import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from 'sub-vn';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [provinces] = useState(getProvinces());
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [userInfo] = useState({
    id: localStorage.getItem('iduser'),
    username: localStorage.getItem('username'),
    name: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
    phone: localStorage.getItem('phone'),
    dob: localStorage.getItem('dob'),
    password: '',
  });

  const [selectedItems, setSelectedItems] = useState(location.state?.selectedItems || []); // Retrieve selected items

  // Handle province change
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setDistricts(getDistrictsByProvinceCode(provinceCode));
    setWards([]);
    setSelectedDistrict('');
  };

  // Handle district change
  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setWards(getWardsByDistrictCode(districtCode));
  };

  // Calculate total price
  const calculateTotal = () =>
    selectedItems.reduce((total, item) => {
      const price = item.productDetails?.discountprice && item.productDetails.discountprice !== -1
        ? item.productDetails.discountprice
        : item.productDetails.price;
      return total + price * item.quantity;
    }, 0);

  // Send order data to backend
  const placeOrder = async () => {
    const wardName = wards.find(ward => ward.code === document.getElementById('ward').value)?.name || '';
    const districtName = districts.find(district => district.code === selectedDistrict)?.name || '';
    const provinceName = provinces.find(province => province.code === selectedProvince)?.name || '';
    const street = document.getElementById('address').value || 'Chưa có địa chỉ';

    const address = {
      street,
      ward: wardName,
      district: districtName,
      province: provinceName,
    };

    const orderData = {
      userId: userInfo.id,
      userInfo,
      selectedItems,
      totalPrice: calculateTotal(),
      address,
    };

    try {
      const response = await fetch('http://localhost:5000/api/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Order placed successfully:', data);
        navigate('/order-confirmation');
      } else {
        console.error('Error placing order:', data.message);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };


  return (
    <div>
      <div id="cart-header" className="flex items-center justify-between text-center text-2xl text-gray-700 p-4 relative">
        <p className="flex-grow text-center font-bold ">Thông Tin Đặt Hàng</p>
        <div className="down absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-[1px] bg-[#e5e5e5]" />
      </div>

      <div className="bg-white rounded-lg p-6 mb-10 mt-10 shadow-md max-w-[600px] mx-auto">
        <p className="text-lg text-center font-bold text-gray-800 border-b-2 border-gray-300 pb-2">
          Thông tin thanh toán
        </p>
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
