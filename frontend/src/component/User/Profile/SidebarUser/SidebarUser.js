import React from 'react';
// import './SidebarUser.css';
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
    <div className="flex">
    <div className="Sidebar top-0 left-0 fixed w-[250px] h-full w-1/5 bg-white p-0 border-r border-gray-300 transition-all duration-500 ease-in-out overflow-hidden">
      <div className="logo-name flex items-center">
        <span className="logo_name text-2xl font-semibold ml-5 mt-20">Xin Chào, {localStorage.getItem('username')}</span>
      </div>
      <div className="menu-items flex flex-col justify-between h-full mt-10">
        <ul className="nav-links space-y-4">
          <li onClick={() => navigate('profile')} >
            <a className="nav-link flex items-center h-12 cursor-pointer hover:bg-orange-500 hover:rounded-lg">
              <i className="fa-regular fa-user text-xl ml-2 min-w-[45px] flex items-center justify-center text-black" />
              <span className="link-name text-lg font-normal text-black ml-2">Thông Tin Tài Khoản</span>
            </a>
          </li>
          <li onClick={() => navigate('history-order')}>
            <a className="nav-link flex items-center h-12 cursor-pointer hover:bg-orange-500 hover:rounded-lg">
              <i className="fa-regular fa-clipboard text-xl ml-2 min-w-[45px] flex items-center justify-center text-black" />
              <span className="link-name text-lg font-normal text-black ml-4">Lịch Sử Mua Hàng</span>
            </a>
          </li>
          {role === 'admin' && (
            <li>
              <a className="nav-links item flex items-center h-12 cursor-pointer hover:bg-orange-500 hover:rounded-lg"onClick={() => navigate('/admin')} >
                <i className="fa-solid fa-user-tie ml-2 text-xl min-w-[45px] flex items-center justify-center text-black" />
                <span className="link-name text-lg font-normal text-black ml-4">Quản Lý</span>
              </a>
            </li>
          )}
          <li>
            <a className="nav-link flex items-center h-12 cursor-pointer hover:bg-orange-500 hover:rounded-lg" href="#" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket ml-2 text-xl min-w-[45px] flex items-center justify-center text-black" />
              <span className="link-name text-lg font-normal text-black ml-4">Đăng Xuất</span>
            </a>
          </li>
          
        </ul>
      </div>
    </div>
    </div>
  );
};

export default SidebarUser;
