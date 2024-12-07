import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

    useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const updatedData = response.data.map(product => ({
          ...product,
          active: product.active || 'Sẵn Hàng',         }));
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

    const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

    const filteredProducts = products.filter(product => {
    const searchValue = searchTerm.toLowerCase();
    return (
      (product.name && product.name.toLowerCase().includes(searchValue)) ||
      (product.category && product.category.toLowerCase().includes(searchValue)) ||
      (product.discountprice && product.discountprice.toString().includes(searchValue))
    );
  });

    const updateStatus = async (index, productId, currentStatus) => {
    const newStatus = currentStatus === 'Sẵn Hàng' ? 'Ngừng Kinh Doanh' : 'Sẵn Hàng';

    try {
      const response = await axios.put(`http://localhost:5000/api/products/${productId}/status`, {
        active: newStatus,       });

      if (response.status === 200) {
        const updatedProducts = [...products];
        updatedProducts[index].active = newStatus;         setProducts(updatedProducts);       } else {
        console.error('Lỗi khi cập nhật trạng thái sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

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
            <button className="btn-register-product" onClick={() => navigate('lowstock')}>Tồn Kho Sắp Hết</button>
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
                  <th>Hành Động</th>
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
                    <td>
  <button
    className="btn-toggle"
    onClick={() => updateStatus(index, product.id, product.active)}   >
    {product.active === 'Sẵn Hàng' ? 'Ngừng Kinh Doanh' : 'Mở Lại'}
  </button>
  <button
    className="btn-edit"
    onClick={() => navigate(`editproduct/${product.id}`)}   >
    Sửa
  </button>
</td>

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

export default ProductManagement;
