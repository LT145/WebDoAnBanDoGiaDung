import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để chuyển hướng
import './InfoUser.css';

const InfoUser = () => {
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage và lưu vào state
  const [userInfo, setUserInfo] = useState({
    id: localStorage.getItem('id'),
    username: localStorage.getItem('username'),
    name: localStorage.getItem('name'),  // Chỉnh lại từ 'username' thành 'name'
    email: localStorage.getItem('email'),
    phone: localStorage.getItem('phone'),
    dob: localStorage.getItem('dob'),
    password: '', // Mật khẩu sẽ không lấy từ localStorage
  });

  const [isEditable, setIsEditable] = useState({
    name: false,
    email: false,
    phone: false,
    dob: false,
    password: false,
  });

  // Hàm để bật/tắt chỉnh sửa trường thông tin
  const editField = (field) => {
    setIsEditable({ ...isEditable, [field]: true });
  };

  // Hàm để cập nhật thông tin lên backend
  const updateInfo = async () => {
    const userId = userInfo.id;  // Lấy 'id' từ state 'userInfo'
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token từ localStorage
        },
        body: JSON.stringify({
          username: userInfo.username,
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          dob: userInfo.dob,
          password: userInfo.password,  // Nếu thay đổi mật khẩu
        }),
      });
    
      const data = await response.json();
      if (response.ok) {
        alert('Thông tin đã được cập nhật!');
      } else {
        alert(data.message || 'Có lỗi xảy ra khi cập nhật thông tin!');
      }
    
      setIsEditable({
        name: false,
        email: false,
        phone: false,
        dob: false,
        password: false,
      });
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };
  

  // Hàm để chuyển hướng đến trang đổi mật khẩu
  const goToChangePassword = () => {
    navigate('/change-password'); // Điều hướng đến trang đổi mật khẩu
  };

  return (
    <div className="dash-content">
      <div className="user-info">
        <p className="user-info-avatar__name">Thông Tin Tài Khoản</p>

        {/* Hiển thị thông tin người dùng */}
        <div className="form__group">
          <label htmlFor="name">Họ và Tên:</label>
          <div className="field">
          <input
              id="name"
              type="text"
              disabled={!isEditable.name}
              className="group__item"
              value={userInfo.name}  // Đảm bảo giá trị 'name' luôn cập nhật
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}  // Cập nhật name trong state
            />
            <i
              className="fa-regular fa-pen-to-square edit-icon"
              onClick={() => editField('name')} // Chỉnh sửa từ 'username' thành 'name'
            />
          </div>
        </div>

        <div className="form__group">
          <label htmlFor="email">Email:</label>
          <div className="field">
            <input
              id="email"
              type="text"
              disabled={!isEditable.email}
              className="group__item"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />
            <i
              className="fa-regular fa-pen-to-square edit-icon"
              onClick={() => editField('email')}
            />
          </div>
        </div>

        <div className="form__group">
          <label htmlFor="phone">Số Điện Thoại:</label>
          <div className="field">
            <input
              id="phone"
              type="text"
              disabled={!isEditable.phone}
              className="group__item"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
            />
            <i
              className="fa-regular fa-pen-to-square edit-icon"
              onClick={() => editField('phone')}
            />
          </div>
        </div>

        <div className="form__group">
          <label htmlFor="dob">Ngày Sinh:</label>
          <div className="field">
            <input
              id="dob"
              type="date"
              disabled={!isEditable.dob}
              className="group__item"
              value={userInfo.dob}
              onChange={(e) => setUserInfo({ ...userInfo, dob: e.target.value })}
            />
            <i
              className="fa-regular fa-pen-to-square edit-icon"
              onClick={() => editField('dob')}
            />
          </div>
        </div>

        <div className="form__group">
          <label htmlFor="password">Đổi Mật Khẩu:</label>
          <div className="field">
            <input
              id="password"
              type="password"
              disabled={!isEditable.password}
              className="group__item"
              value={userInfo.password}
              onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
            />
            <i
              className="fa-regular fa-pen-to-square edit-icon"
              onClick={() => editField('password')}
            />
          </div>
        </div>

        <div
          className="btn-form__submit button__update-info"
          onClick={updateInfo}
        >
          Cập nhật thông tin
        </div>

        <div
          className="btn-form__submit button__change-password"
          onClick={goToChangePassword}
        >
          Đổi Mật Khẩu
        </div>
      </div>
    </div>
  );
};

export default InfoUser;
