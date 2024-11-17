// src/components/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Xóa token và thông tin người dùng trong localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    // Điều hướng về trang login
    navigate('/home');
    window.location.reload();
  };
  return (
    <div className='sidebar'>
      <div className="logo-name">
        <span className="logo_name">Xin Chào, {localStorage.getItem('username')}</span>
      </div>
      <div className="menu-items">
        <ul className="nav-links">
          <li>
            <div className='nav-link' onClick={() => navigate('/home')}>
              <i className="fa-solid fa-house" />
              <span className="link-name">Home</span>
            </div>
          </li>
          <li>
            <div onClick={() => navigate('userad')}>
              <i className="fa-solid fa-user" />
              <span className="link-name">Quản Lý User</span>
            </div>
          </li>
          <li>
            <div onClick={() => navigate('adminad')}>
              <i className="fa-solid fa-user" />
              <span className="link-name">Quản Lý Admin</span>
            </div>
          </li>
          <li>
            <div onClick={() => navigate('/products')}>
              <i className="fa-solid fa-box" />
              <span className="link-name">Quản Lý Sản Phẩm</span>
            </div>
          </li>
          <li>
            <div onClick={() => navigate('/feedback')}>
              <i className="fa-solid fa-message" />
              <span className="link-name">Phản Hồi Khách Hàng</span>
            </div>
          </li>
          <li>
            <div>
              <i className="fa-solid fa-money-check-dollar" />
              <span className="link-name">Doanh Thu</span>
            </div>
          </li>
          <li>
            <div>
              <i className="fa-solid fa-share" />
              <span className="link-name">Share</span>
            </div>
          </li>
        </ul>
        <ul className="logout-mode">
          <li>
            <div  onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket" />
              <span className="link-name">Logout</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
