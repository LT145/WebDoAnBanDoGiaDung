// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Cập nhật ở đây
import Sidebar from './components/Sidebar';
import AdminNavbar from './components/Navbar';
import ProductTable from './components/ProductTable';
import AdminHome from './components/Home'; // Nhập AdminHome
import './admin.css';

function Admin() {
  return (
    <Router>
      <div className="admin-dashboard">
        <AdminNavbar />
        <div className="d-flex">
          <Sidebar />
          <div className="content p-3">
            <Routes> {/* Thay Switch bằng Routes */}
              <Route path="/home" element={<AdminHome />} /> {/* Cập nhật cách sử dụng Route */}
              <Route path="/products" element={<ProductTable />} />
              {/* Thêm các tuyến đường khác nếu cần */}
              <Route path="/" element={<AdminHome />} /> {/* Mặc định là AdminHome */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default Admin;
