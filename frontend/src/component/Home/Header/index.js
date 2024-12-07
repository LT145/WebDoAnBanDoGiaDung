import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; import './Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from './img/logo.png'; 
const Nav = () => {
  const navigate = useNavigate(); 
  const [currentLocation, setCurrentLocation] = useState('Hồ Chí Minh');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [locationsData, setLocationsData] = useState([]);
  const [username, setUsername] = useState(''); 
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
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
        setLocationsData(data);       } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();

        const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []); 
    useEffect(() => {
    const handleStorageChange = () => {
      const savedUsername = localStorage.getItem('username');
      if (savedUsername) {
        setUsername(savedUsername);
      }
    };

        window.addEventListener('storage', handleStorageChange);

        return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const goToLogin = () => {
    navigate('/login');   };

  const goToProfile = () => {
    navigate('/profile');   };

  return (
    <div id="header">
      <div className="menu">
        <div className="logo_menu" onClick={() => navigate('/home')}>
          <img src={logo} alt="" />
        </div>
        <div id="location">
          <div className="icon_location" onClick={toggleDropdown}>
            <i className="fa-solid fa-location-dot" />
            <p>
              Giá xem tại <br /> {currentLocation}
            </p>
            <i className="fa-solid fa-chevron-down" />
          </div>

          {isDropdownOpen && (
            <ul className="location_dropdown">
              {locationsData.map((location) => (
                <li
                  key={location.id}
                  onClick={() => handleLocationChange(location.name)}
                  className={location.name === currentLocation ? 'active' : ''}
                >
                  {location.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="search">
          <input
            style={{ textAlign: "center" }}
            className="btn_search"
            type="search"
            placeholder="Bạn cần tìm sản phẩm gì?"
          />
          <i className="fa-solid fa-magnifying-glass" />
        </div>
        <div id="Phone">
          <div className="icon_phone">
            <i
              className="fa-solid fa-phone"
              style={{ color: "white", fontSize: 25 }}
            />
          </div>
          <div className="SDT">
            <p>
              Gọi mua hàng <br /> 18003638
            </p>
          </div>
        </div>
        <div id="Bag" onClick={() => navigate('/cart')}>
          <div className="icon_Bag">
            <i
              className="fa-solid fa-bag-shopping"
              style={{ color: "white", fontSize: 25 }}
            />
          </div>
          <div className="Bag_text">
            <p>Giỏ hàng</p>
          </div>
        </div>
        <div id="user">
          <div className="icon_user" onClick={username ? goToProfile : goToLogin}>
            <i
              className="fa-solid fa-user"
              style={{ color: "white", fontSize: 20 }}
            />
            <p>{username ? username : 'Đăng nhập'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
