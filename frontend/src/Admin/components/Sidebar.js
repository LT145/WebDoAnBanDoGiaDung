// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-light sidebar">
      <div className="list-group p-3">
        <Link to="/home" className="list-group-item list-group-item-action">Home</Link>
        <Link to="/products" className="list-group-item list-group-item-action">Products</Link>
        {/* Thêm các liên kết khác nếu cần */}
      </div>
    </div>
  );
};

export default Sidebar;
