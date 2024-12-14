import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để chuyển hướng

const InfoUser = () => {
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage và lưu vào state
  const [userInfo, setUserInfo] = useState({
    id: localStorage.getItem('id'),
    username: localStorage.getItem('username'),
    name: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
    phone: localStorage.getItem('phone'),
    dob: localStorage.getItem('dob'),
    password: '',
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
    const userId = userInfo.id;
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          username: userInfo.username,
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          dob: userInfo.dob,
          password: userInfo.password,
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
    navigate('/reset-password'); // Điều hướng đến trang đổi mật khẩu
  };

  return (
    <div className="flex-1 bg-white min-h-screen mt-20 p-2.5 transition-all duration-500 ease-in-out">
      <div className="user-info w-full max-w-2xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg">
        <p className="text-2xl font-semibold mb-6">Thông Tin Tài Khoản</p>

        {/* Hiển thị thông tin người dùng */}
        <div className="form__group mb-4">
          <label htmlFor="name" className="block text-sm mb-2">Họ và Tên:</label>
          <div className="relative">
            <input
              id="name"
              type="text"
              disabled={!isEditable.name}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-200 text-sm"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            />
            <i
              className="fa-regular fa-pen-to-square absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 cursor-pointer"
              onClick={() => editField('name')}
            />
          </div>
        </div>

        <div className="form__group mb-4">
          <label htmlFor="email" className="block text-sm mb-2">Email:</label>
          <div className="relative">
            <input
              id="email"
              type="text"
              disabled={!isEditable.email}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-200 text-sm"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />
            <i
              className="fa-regular fa-pen-to-square absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 cursor-pointer"
              onClick={() => editField('email')}
            />
          </div>
        </div>

        <div className="form__group mb-4">
          <label htmlFor="phone" className="block text-sm mb-2">Số Điện Thoại:</label>
          <div className="relative">
            <input
              id="phone"
              type="text"
              disabled={!isEditable.phone}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-200 text-sm"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
            />
            <i
              className="fa-regular fa-pen-to-square absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 cursor-pointer"
              onClick={() => editField('phone')}
            />
          </div>
        </div>

        <div className="form__group mb-4">
          <label htmlFor="dob" className="block text-sm mb-2">Ngày Sinh:</label>
          <div className="relative">
            <input
              id="dob"
              type="date"
              disabled={!isEditable.dob}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-200 text-sm"
              value={userInfo.dob}
              onChange={(e) => setUserInfo({ ...userInfo, dob: e.target.value })}
            />
            <i
              className="fa-regular fa-pen-to-square absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 cursor-pointer"
              onClick={() => editField('dob')}
            />
          </div>
        </div>

        <div className="mb-4">
          <button
            className="w-full py-3 bg-orange-400 text-white rounded-md text-sm font-semibold hover:bg-orange-500"
            onClick={updateInfo}
          >
            Cập nhật thông tin
          </button>
        </div>

        <div className="mb-4">
          <button
            className="w-full py-3 bg-gray-500 text-white rounded-md text-sm font-semibold hover:bg-gray-600"
            onClick={goToChangePassword}
          >
            Đổi Mật Khẩu
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoUser;
