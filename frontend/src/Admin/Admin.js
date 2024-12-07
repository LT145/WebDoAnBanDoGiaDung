import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; import Sidebar from './components/Sidebar';
import User from './components/User';
import Adminad from './components/Adminad';
import RegisterAdmin from './components/RegisterAdmin';
import Home from '../Views/Home';
import './admin.css';
import ProductManagement from './components/Products';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import Stockimport from './components/Stockimport';
import LowStock from './components/LowStock';
import OrderManager from './components/OrderManager';
import OrderDetails from './components/OrderDetails';

function Admin() {
    const role = localStorage.getItem('role');

    if (role !== 'admin') {
    return <Navigate to="/home" />;   }

  return (
    <div className="admin-dashboard">
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space--=', height: '100%', gap: '15px', margin: '0px auto', minWidth: '1150px', position: 'absolute' }}>
        <Sidebar />
        <div style={{ width: '70%' , right:'0px'}}>
          <Routes>
            <Route path="userad" element={<User />} />
            <Route path="adminad" element={<Adminad />} />
            <Route path="adminad/registerAdmin" element={<RegisterAdmin />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/addproduct" element={<AddProduct />} />
            <Route path="products/editproduct/:id" element={<EditProduct />} />
            <Route path="products/stockimport" element={<Stockimport />} />
            <Route path="products/lowstock" element={<LowStock />} />
            <Route path="ordermanager" element={<OrderManager />} />
            <Route path="ordermanager/orderdetail" element={<OrderDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Admin;
