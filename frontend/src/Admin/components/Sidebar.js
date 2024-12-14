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
     <div className="flex">
    <div className="sidebar fixed top-0 left-0 h-full w-1/5 bg-[#F29F41] p-4 border-r border-gray-300 transition-all duration-500 ease-in-out overflow-hidden">
      <div className="logo-name flex items-center">
        <span className="logo_name text-2xl font-semibold ml-4">Xin Chào, {localStorage.getItem('username')}</span>
      </div>
      <div className="menu-items flex flex-col justify-between h-full mt-10">
        <ul className="nav-links space-y-4">
          <li>
            <div className="nav-link flex items-center h-12 cursor-pointer hover:bg-white hover:rounded-lg" onClick={() => navigate('/home')}>
              <i className="fa-solid fa-house text-xl min-w-[45px] flex items-center justify-center text-black" />
              <span className="link-name text-lg font-normal text-black ml-4">Home</span>
            </div>
          </li>
          <li>
            <div onClick={() => navigate('userad')} className="flex items-center h-12 cursor-pointer hover:bg-white hover:rounded-lg">
              <i className="fa-solid fa-user text-xl min-w-[45px] flex items-center justify-center text-black" />
              <span className="link-name text-lg font-normal text-black ml-4">Quản Lý User</span>
            </div>
          </li>
          <li>
            <div onClick={() => navigate('adminad')} className="flex items-center h-12 cursor-pointer hover:bg-white hover:rounded-lg">
              <i className="fa-solid fa-user-tie text-xl min-w-[45px] flex items-center justify-center text-black" />
              <span className="link-name text-lg font-normal text-black ml-4">Quản Lý Admin</span>
            </div>
          </li>
          <li>
            <div onClick={() => navigate('products')} className="flex items-center h-12 cursor-pointer hover:bg-white hover:rounded-lg">
              <i className="fa-solid fa-box text-xl min-w-[45px] flex items-center justify-center text-black" />
              <span className="link-name text-lg font-normal text-black ml-4">Quản Lý Sản Phẩm</span>
            </div>
          </li>
          <li>
            <div onClick={() => navigate('ordermanager')} className="flex items-center h-12 cursor-pointer hover:bg-white hover:rounded-lg">
              <i className="fa-solid fa-gift text-xl min-w-[45px] flex items-center justify-center text-black" />
              <span className="link-name text-lg font-normal text-black ml-4">Quản Lý Đơn Hàng</span>
            </div>
          </li>
        </ul>
        <ul className="logout-mode mt-4 pt-4 border-t border-gray-300">
          <li>
            <div onClick={handleLogout} className="flex items-center h-12 cursor-pointer hover:bg-white hover:rounded-lg">
              <i className="fa-solid fa-right-from-bracket text-xl min-w-[45px] flex items-center justify-center text-black" />
              <span className="link-name text-lg font-normal text-black ml-4">Logout</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    </div>
  );
};

export default Sidebar;
