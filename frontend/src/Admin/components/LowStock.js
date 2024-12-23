import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LowStock = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Gọi API để lấy danh sách sản phẩm và danh mục từ backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const updatedData = response.data.map(product => ({
          ...product,
          active: product.active || 'Sẵn Hàng', // Thiết lập giá trị mặc định cho active nếu chưa có
        }));
        setProducts(updatedData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu danh mục:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Hàm tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Lọc danh sách sản phẩm theo giá trị tìm kiếm và chỉ lấy những sản phẩm có số lượng < 5
  const filteredProducts = products.filter(product => {
    const searchValue = searchTerm.toLowerCase();
    // Đảm bảo kiểm tra số lượng < 5 và tìm kiếm theo tên, danh mục, và giá trị giảm giá
    return (
      (product.name && product.name.toLowerCase().includes(searchValue)) ||
      (product.category && product.category.toLowerCase().includes(searchValue)) ||
      (product.discountprice && product.discountprice.toString().includes(searchValue))
    ) && product.quantity < 5; // Đảm bảo lọc sản phẩm có số lượng dưới 5
  });
  // Lấy tên danh mục cho từng sản phẩm
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Không Xác Định';
  };

  return (
    <section className="dashboard">
      <div className="top">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm...."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="dash-content">
        <div className="overview">
          <div className="title">
            <div style={{display:'flex'}}>
              <i className="fa-solid fa-box" />
              <span className="text">Quản Lý Sản Phẩm</span>
            </div>
            <button className="btn-register-product" onClick={() => navigate('addproduct')}>Thêm Sản Phẩm</button>
            <button className="btn-register-product" onClick={() => navigate('stockimport')}>Nhập Hàng</button>
          </div>
          {/* Bảng thông tin sản phẩm */}
          <div className="product-table">
            <table>
              <thead>
                <tr>
                  <th>Tên Sản Phẩm</th>
                  <th>Ảnh</th>
                  <th>Giá</th>
                  <th>Giảm Giá</th>
                  <th>Danh Mục</th>
                  <th>Số Lượng</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td><img src={product.img} alt={product.name} style={{ width: '100px' }} /></td>
                    <td>{product.price.toLocaleString()}</td> {/* Sửa từ oldprice thành price */}
                    <td>{product.discountprice !== -1 ? product.discountprice.toLocaleString() : 'Không có giảm giá'}</td> {/* Sửa từ newprice thành discountprice */}
                    <td>{getCategoryName(product.categoryId)}</td>
                    <td>{product.quantity === 0 ? 'Hết Hàng' : product.quantity}</td>
                    <td>{product.active}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LowStock;
