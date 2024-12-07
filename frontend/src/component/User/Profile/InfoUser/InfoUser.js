import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; import './InfoUser.css';

const InfoUser = () => {
  const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
    id: localStorage.getItem('id'),
    username: localStorage.getItem('username'),
    name: localStorage.getItem('name'),      email: localStorage.getItem('email'),
    phone: localStorage.getItem('phone'),
    dob: localStorage.getItem('dob'),
    password: '',   });

  const [isEditable, setIsEditable] = useState({
    name: false,
    email: false,
    phone: false,
    dob: false,
    password: false,
  });

    const editField = (field) => {
    setIsEditable({ ...isEditable, [field]: true });
  };

    const updateInfo = async () => {
    const userId = userInfo.id;      try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,         },
        body: JSON.stringify({
          username: userInfo.username,
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          dob: userInfo.dob,
          password: userInfo.password,          }),
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
  

    const goToChangePassword = () => {
    navigate('/reset-password');   };

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
              value={userInfo.name}                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}              />
            <i
              className="fa-regular fa-pen-to-square edit-icon"
              onClick={() => editField('name')}             />
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
