import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
import Home from './Views/Home';  // Trang Home
import Login from './Views/Login/Login';  // Trang Login
import Nav from './component/Home/Header'; // Component Nav
import Admin from './Admin/Admin'; // Trang Admin
import Profile from './Views/Profile';
import Register from './component/User/Register';
import './App.css'
import FPW from './component/User/ForgetPassword';
import OTP from './component/User/OTP';
import ResetPassword from './component/User/ResetPass';

function App() {
  const location = useLocation(); // Lấy đường dẫn hiện tại

  return (
    <>
      {/* Chỉ hiển thị Nav nếu không phải là trang /admin */}
      {!location.pathname.startsWith('/admin') && <Nav />} 

      <Routes>
        <Route path="/" element={<Home />} /> {/* Trang Home */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} /> {/* Trang Login */}
        <Route path="/admin/*" element={<Admin />} /> {/* Trang Admin */}
        <Route path="/user" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/fpw" element={<FPW />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;