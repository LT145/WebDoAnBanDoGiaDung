import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; import Home from './Views/Home'; import Login from './Views/Login/Login'; import Nav from './component/Home/Header'; import Admin from './Admin/Admin'; import Profile from './Views/Profile';
import Register from './component/User/Register';
import './App.css'
import FPW from './component/User/ForgetPassword';
import OTP from './component/User/OTP';
import ResetPassword from './component/User/ResetPass';
import ListProduct from './component/Product/ListProduct';
import Cart from './component/Cart/Cart';
import Order from './component/Order/order';
import OrderConfirmation from './component/Order/OrderConfirmation/OrderConfirmation';
function App() {
  const location = useLocation();
  return (
    <>
      {/* Chỉ hiển thị Nav nếu không phải là trang /admin */}
      {!location.pathname.startsWith('/admin') && <Nav />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/user" element={<Home />} />
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/fpw" element={<FPW />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
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
