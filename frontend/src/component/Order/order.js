import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from 'sub-vn';

const Order = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [provinces] = useState(getProvinces());
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [selectedItems, setSelectedItems] = useState(location.state?.selectedItems || []);
  const [userInfo] = useState({
    id: localStorage.getItem('iduser'),
    name: localStorage.getItem('name'),
    phone: localStorage.getItem('phone'),
    email: localStorage.getItem('email'),
  });

  const [address, setAddress] = useState('');

  // Kiểm tra query error khi thanh toán thất bại
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
  }, [location]);

  // Tính tổng tiền
  const calculateTotal = () => 
    selectedItems.reduce((total, item) => {
      const price = item.productDetails?.discountprice !== -1
        ? item.productDetails?.discountprice
        : item.productDetails?.price;
      return total + price * item.quantity;
    }, 0);

  // Xử lý thay đổi tỉnh
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setDistricts(getDistrictsByProvinceCode(provinceCode));
    setWards([]);
    setSelectedDistrict('');
    setSelectedWard('');
  };

  // Xử lý thay đổi quận
  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setWards(getWardsByDistrictCode(districtCode));
    setSelectedWard('');
  };

  // Đặt hàng
  const placeOrder = async () => {
    const provinceName = provinces.find((p) => p.code === selectedProvince)?.name || '';
    const districtName = districts.find((d) => d.code === selectedDistrict)?.name || '';
    const wardName = wards.find((w) => w.code === selectedWard)?.name || '';

    const fullAddress = `${address}, ${wardName}, ${districtName}, ${provinceName}`;

    const orderData = {
      userId: userInfo.id,
      userInfo,
      selectedItems,
      totalPrice: calculateTotal(),
      address: fullAddress,
      paymentMethod,
    };

    try {
      if (paymentMethod === 'momo') {
        const momoResponse = await fetch('http://localhost:5000/api/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: calculateTotal(), orderInfo: `Đặt hàng từ ${userInfo.name}` }),
        });

        const momoData = await momoResponse.json();
        if (momoResponse.ok && momoData.payUrl) {
          window.location.href = momoData.payUrl;
        } else {
          alert('Có lỗi xảy ra khi kết nối với MoMo.');
        }
      } else {
        await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
        navigate('/order-success');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại!');
    }
  };
  return (
    <div>
      <div id="cart-header" className="flex items-center justify-between text-center text-2xl text-gray-700 p-4 relative">
        <p className="flex-grow text-center font-bold ">Thông Tin Đặt Hàng</p>
        <div className="down absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-[1px] bg-[#e5e5e5]" />
      </div>
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4 text-center">
          Thanh toán thất bại: {errorMessage}
        </div>
      )}
      <div className="bg-white rounded-lg p-6 mb-10 mt-10 shadow-md max-w-[600px] mx-auto">
        <div className="space-y-6 mt-5">
          {/* Tên và Số điện thoại */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên người nhận
              </label>
              <input
                type="text"
                placeholder="Nhập tên người nhận"
                maxLength={100}
                autoComplete="off"
                value={userInfo.name || ''}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="relative w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                maxLength={15}
                autoComplete="off"
                value={userInfo.phone || ''}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Chọn Tỉnh và Quận */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tỉnh/Thành phố
              </label>
              <select
                id="province"
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="" disabled>
                  Chọn tỉnh/thành phố
                </option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quận/Huyện
              </label>
              <select
                id="district"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="" disabled>
                  Chọn quận/huyện
                </option>
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chọn Xã và Địa chỉ */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phường/Xã
              </label>
              <select
                id="ward"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Chọn phường/xã</option>
                {wards.map((ward) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số nhà/Đường
              </label>
              <input
                id="address"
                type="text"
                placeholder="Nhập số nhà/đường"
                maxLength={200}
                autoComplete="off"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phương thức thanh toán
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                <option value="momo">Thanh toán qua Momo</option>
              </select>
            </div>
          </div>  
        </div>
      </div>


      {/* Display Selected Items with Images */}
      <div className="cart-item-wrapper mb-[70px]">
        {selectedItems.length === 0 ? (
          <p>
            Giỏ hàng của bạn hiện tại trống
          </p>
        ) : (
          selectedItems.map((item, index) => {
            const { productDetails, quantity } = item;
            return (
              <div key={index} className="cart-item-container mb-10 relative flex flex-col gap-5 bg-white rounded-lg p-5 shadow-md mx-auto mb-5 max-w-[600px] overflow-hidden">
                <div className="cart-item flex gap-5 items-center relative min-h-[120px]">
                  <div className="checkbox-product">
                    <label htmlFor={`product-checkbox-${item.productId}`}>
                      <img
                        src={productDetails?.img || '/img/default-product.jpg'}
                        alt={productDetails?.name || 'Sản phẩm không có tên'}
                        className="product-img w-[100px] h-[100px] object-cover rounded-md"
                      />
                    </label>
                  </div>
                  <div className="product-info flex-grow">
                    <a href="#" className="product-name text-lg font-bold text-gray-800 hover:text-[#F29F41]">
                      {productDetails?.name || 'Tên sản phẩm không có'}
                    </a>
                    <div className="box-info_box-price flex gap-3 mt-1 justify-between flex-wrap">
                      <p className="product_price--show text-red-600 text-lg">
                        {productDetails?.discountprice && productDetails.discountprice !== -1 ? (
                          <span className="product-discountprice">
                            {productDetails.discountprice.toLocaleString('vi-VN')} VND
                          </span>
                        ) : (
                          <span>{productDetails?.price.toLocaleString('vi-VN')} VND</span>
                        )}
                      </p>
                      <div className="quantity-show ">
                        Số lượng:
                        <span>  {quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="buy flex justify-center items-center">
        <div id="BottomBar" className="flex justify-between items-center bg-white border border-[#919EAB3C] rounded-t-lg shadow-[0_-4px_20px_-1px_rgba(40,124,234,.15)] px-4 py-3 fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] z-11">
          <p className="text-gray-700">
            Tổng tiền: <span className="text-red-600 font-semibold">{calculateTotal().toLocaleString('vi-VN')} VND</span>
          </p>
          <button
            className="btn-action px-4 py-2 bg-gray-400 text-white rounded-md text-lg hover:bg-[#E29A34]"
            onClick={placeOrder} // Trigger order placement
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
