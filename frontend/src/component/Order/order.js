import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './order.css';
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

  const [selectedItems, setSelectedItems] = useState(location.state?.selectedItems || []); 
    const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setDistricts(getDistrictsByProvinceCode(provinceCode)); 
    setWards([]);
    setSelectedDistrict('');
  };

    const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setWards(getWardsByDistrictCode(districtCode));
  };

    const calculateTotal = () =>
    selectedItems.reduce((total, item) => {
      const price = item.productDetails?.discountprice && item.productDetails.discountprice !== -1
        ? item.productDetails.discountprice
        : item.productDetails.price;
      return total + price * item.quantity;
    }, 0);

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
      <div id="cart-header">
        <p>Thông Tin Đặt Hàng</p>
        <div className="down" />
      </div>

      <div className="block-payment">
        <div className="block-payment__wrapper">
          <div className="block-payment__main">
            {/* Customer Name and Phone */}
            <div className="form-row">
              <div className="box-input">
                <input
                  type="text"
                  placeholder="Tên người nhận"
                  maxLength={100}
                  autoComplete="off"
                  value={userInfo.name || ''}
                  className="box-input__main"
                />
                <label>Tên người nhận</label>
                <div className="box-input__line" />
              </div>
              <div className="box-input">
                <input
                  type="text"
                  placeholder="Số điện thoại người nhận"
                  maxLength={15}
                  autoComplete="off"
                  value={userInfo.phone || ''}
                  className="box-input__main"
                />
                <label>Số điện thoại</label>
                <div className="box-input__line" />
              </div>
            </div>

            {/* Province and District Selection */}
            <div className="form-row">
              <div className="box-input">
                <select
                  className="box-input__main"
                  id="province"
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                >
                  <option value="" disabled>
                    TỈNH / THÀNH PHỐ
                  </option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
                <label>Tỉnh/Thành phố</label>
              </div>
              <div className="box-input">
                <select
                  className="box-input__main"
                  id="district"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                >
                  <option value="" disabled>
                    QUẬN / HUYỆN
                  </option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
                    </option>
                  ))}
                </select>
                <label>Quận/Huyện</label>
              </div>
            </div>

            {/* Ward Selection and Address */}
            <div className="form-row">
              <div className="box-input">
                <select className="box-input__main" id="ward">
                  <option value="">PHƯỜNG / XÃ</option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                      {ward.name}
                    </option>
                  ))}
                </select>
                <label>Phường/Xã</label>
              </div>
              <div className="box-input">
                <input
                  id="address"
                  type="text"
                  placeholder="Số nhà/Đường"
                  maxLength={200}
                  autoComplete="off"
                  className="box-input__main"
                />
                <label>Số nhà/Đường</label>
                <div className="box-input__line" />
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Display Selected Items with Images */}
      <div className="cart-item-wrapper">
        {selectedItems.length === 0 ? (
          <p>Giỏ hàng của bạn hiện tại trống</p>
        ) : (
          selectedItems.map((item, index) => {
            const { productDetails, quantity } = item;
            return (
              <div key={index} className="cart-item-container">
                <div className="cart-item">
                  <div className="checkbox-product">
                    <label htmlFor={`product-checkbox-${item.productId}`}>
                      <img
                        src={productDetails?.img || '/img/default-product.jpg'}
                        alt={productDetails?.name || 'Sản phẩm không có tên'}
                        className="product-img"
                      />
                    </label>
                  </div>
                  <div className="product-info">
                    <a href="#" className="product-name">
                      {productDetails?.name || 'Tên sản phẩm không có'}
                    </a>
                    <div className="box-info_box-price">
                      <p className="product_price--show">
                        {productDetails?.discountprice && productDetails.discountprice !== -1 ? (
                          <span className="product-discountprice">
                            {productDetails.discountprice.toLocaleString('vi-VN')} VND
                          </span>
                        ) : (
                          <span>{productDetails?.price.toLocaleString('vi-VN')} VND</span>
                        )}
                      </p>
                      <div className="quantity-show"> 
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

      <div className="buy">
        <div id="BottomBar">
          <p>
            Tổng tiền: <span>{calculateTotal().toLocaleString('vi-VN')} VND</span>
          </p>
          <button
            className="btn-action"
            onClick={placeOrder}           >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
