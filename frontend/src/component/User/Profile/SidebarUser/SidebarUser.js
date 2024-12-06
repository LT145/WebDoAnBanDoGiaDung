import React from 'react';
import './SidebarUser.css';
import { useNavigate } from 'react-router-dom';  // Import useNavigate để điều hướng

const SidebarUser = () => {
  const navigate = useNavigate();  // Khởi tạo navigate từ useNavigate

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Xóa token và thông tin người dùng trong localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    // Điều hướng về trang login
    navigate('/login');
    window.location.reload();
  };

  // Lấy role từ localStorage
  const role = localStorage.getItem('role');

  return (
    <div className="Sidebar">
      <div className="logo-name">
        <span className="logo_name">Xin Chào, {localStorage.getItem('username')}</span>
      </div>
      <div className="menu-items">
        <ul className="nav-links">
          <li onClick={() => navigate('profile')}>
            <a>
              <i className="fa-regular fa-user" />
              <span className="link-name">Thông Tin Tài Khoản</span>
            </a>
          </li>
          <li onClick={() => navigate('history-order')}>
            <a>
              <i className="fa-regular fa-clipboard" />
              <span className="link-name">Lịch Sử Mua Hàng</span>
            </a>
          </li>
          {role === 'admin' && (
            <ul className="nav-links">
            <li>
              <div className='item' onClick={() => navigate('/admin')}>
                <i className="fa-solid fa-user" />
                <span className="link-name">Quản Lý</span>
              </div>
            </li>
            </ul>
          )}
          <li>
            <a href="#" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket" />
              <span className="link-name">Đăng Xuất</span>
            </a>
          </li>
          
        </ul>
      </div>
    </div>
  );
};

export default SidebarUser;
