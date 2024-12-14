import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './img/logo.png'; // Đảm bảo đường dẫn đúng

const Nav = () => {
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState('Hồ Chí Minh');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [locationsData, setLocationsData] = useState([]);
  const [username, setUsername] = useState('');
  const [isMenuOpen, setMenuOpen] = useState(false); // Trạng thái mở menu

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen); // Đổi trạng thái menu
  };

  const handleLocationChange = (location) => {
    setCurrentLocation(location);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/locations');
        const data = await response.json();
        setLocationsData(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();

    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const goToLogin = () => navigate('/login');
  const goToProfile = () => navigate('/profile');

  return (
    <div className="bg-gradient-to-r from-orange-400 to-orange-400 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/home')}>
          <img src={logo} alt="Logo" className="h-12 transition-transform hover:scale-110" />
        </div>

        {/* Vị trí */}
        <div className="relative">
          <div
            className="flex items-center bg-white  px-3 py-1.5 rounded-full shadow-md cursor-pointer transition hover:bg-gray-100"
            onClick={toggleDropdown}
          >
            <i className="fa-solid text-orange-600 fa-location-dot text-lg mr-2"></i>
            <span className="text-sm text-black-600 font-medium">Giá xem tại {currentLocation}</span>
            <i className="fa-solid fa-chevron-down ml-2"></i>
          </div>
          {isDropdownOpen && (
            <ul className="absolute mt-2 w-52 bg-white shadow-md rounded-md overflow-hidden z-10">
              {locationsData.map((location) => (
                <li
                  key={location.id}
                  onClick={() => handleLocationChange(location.name)}
                  className={`px-4 py-2 text-sm  cursor-pointer hover:bg-orange-100 transition ${location.name === currentLocation ? 'font-bold bg-orange-50' : ''
                    }`}
                >
                  {location.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search */}
        <div className="hidden lg:flex bg-white rounded-full w-1/3 items-center shadow-md px-3 py-1.5">
          <i className="fa-solid fa-magnifying-glass text-orange-400 mr-2"></i>
          <input
            type="search"
            placeholder="Bạn cần tìm sản phẩm gì?"
            className="w-full border-none focus:outline-none text-sm text-gray-700"
          />
        </div>

        {/* Contact Info */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Gọi mua hàng */}
          <div className="flex items-center border border-orange-300 bg-white rounded-full px-3 py-1.5 shadow-sm cursor-pointer hover:bg-orange-50 transition">
            <i className="fa-solid fa-phone text-orange-500 text-lg mr-2"></i>
            <p className="text-black-600 text-sm font-medium">
              Gọi mua hàng <br />
            </p>
          </div>

          {/* Giỏ hàng */}
          <div className="flex items-center border border-orange-300 bg-white rounded-full px-3 py-1.5 shadow-sm cursor-pointer hover:bg-orange-50 transition"
           onClick={() => navigate('/cart')}
          >
            <i className="fa-solid fa-bag-shopping text-orange-500 text-lg mr-2"></i>
            <p className="text-black-600 text-sm font-medium">Giỏ hàng</p>
          </div>

          {/* User */}
          <div
            className="flex items-center border border-orange-300 bg-white rounded-full px-3 py-1.5 shadow-sm cursor-pointer hover:bg-orange-50 transition"
            onClick={username ? goToProfile : goToLogin}
          >
            <i className="fa-solid fa-user text-orange-500 text-lg mr-2"></i>
            <p className="text-black-600 text-sm font-medium">{username || 'Đăng nhập'}</p>
          </div>
        </div>

        {/* Hamburger menu for mobile */}
        <div className="lg:hidden flex items-center" onClick={toggleMenu}>
          <i className="fa-solid fa-bars text-black z-50 text-xl"></i>
        </div>
      </div>

      {/* Responsive Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white p-4 absolute top-0 left-0 w-full z-40 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            {/* Giỏ hàng */}
            <div className="flex items-center border border-orange-300 bg-white rounded-full px-3 py-1.5 shadow-sm cursor-pointer hover:bg-orange-50 transition"
              onClick={() => navigate('/cart')}
            >
              <i className="fa-solid fa-bag-shopping text-orange-500 text-lg mr-2"></i>
              <p className="text-black-600 text-sm font-medium">Giỏ hàng</p>
            </div>

            {/* User */}
            <div
              className="flex items-center border border-orange-300 bg-white rounded-full px-3 py-1.5 shadow-sm cursor-pointer hover:bg-orange-50 transition"
              onClick={username ? goToProfile : goToLogin}
            >
              <i className="fa-solid fa-user text-orange-500 text-lg mr-2"></i>
              <p className="text-black-600 text-sm font-medium">{username || 'Đăng nhập'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav;
