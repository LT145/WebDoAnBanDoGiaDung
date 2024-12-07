import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
        localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

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
            <div onClick={() => navigate('products')}>
              <i className="fa-solid fa-box" />
              <span className="link-name">Quản Lý Sản Phẩm</span>
            </div>
          </li>
          <li>
            <div onClick={() => navigate('ordermanager')}>
              <i className="fa-solid fa-message" />
              <span className="link-name">Quản Lý Đơn Hàng</span>
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
