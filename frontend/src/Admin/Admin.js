// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate để chuyển hướng
import Sidebar from './components/Sidebar';
import User from './components/User';
import Adminad from './components/Adminad';
import RegisterAdmin from './components/RegisterAdmin';
import Home from '../Views/Home';
import './admin.css';

function Admin() {
  // Lấy role từ localStorage
  const role = localStorage.getItem('role');

  // Kiểm tra nếu không phải là admin thì chuyển hướng về trang login
  if (role !== 'admin') {
    return <Navigate to="/home" />; // Chuyển hướng về trang login nếu không phải admin
  }

  return (
    <div className="admin-dashboard">
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', height: '100%', gap: '15px', margin: '0px auto', minWidth: '1150px', position: 'absolute' }}>
        <Sidebar />
        <div style={{ width: '78%' }}>
          <Routes>
            <Route path="userad" element={<User />} />
            <Route path="adminad" element={<Adminad />} />
            <Route path="adminad/registerAdmin" element={<RegisterAdmin />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Admin;
