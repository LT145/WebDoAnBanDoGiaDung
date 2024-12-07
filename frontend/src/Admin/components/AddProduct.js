import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [isDiscount, setIsDiscount] = useState(false);
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(-1);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu danh mục:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const priceValue = Number(price); const quantityValue = Number(quantity);
    const formData = new FormData();
    formData.append('product-name', e.target['product-name'].value);
    formData.append('product-quantity', quantityValue); formData.append('product-category', selectedCategory);
    formData.append('product-price', priceValue); formData.append('is-discount', isDiscount);

    if (isDiscount && discountPrice > 0) {
      formData.append('product-discount-price', discountPrice);
    }

    formData.append('product-image', e.target['product-image'].files[0]);
    try {
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      alert('Thêm sản phẩm thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <section className="dashboard">
      <div className="top">
        <i className="fa-solid fa-bars sidebar-toggle" />
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass" />
          <input type="text" placeholder="Search...." />
        </div>
      </div>
      <div className="dash-content">
        <div className="product-management">
          <div className="title">
            <i className="fa-solid fa-box" />
            <span className="text">Quản Lý Sản Phẩm</span>
            <button className="btn-register-product" onClick={() => navigate('/admin/products')}>Toàn Bộ Sản Phẩm</button>
            <button className="btn-register-product" onClick={() => navigate('/admin/products/stockimport')}>Nhập Hàng</button>
            <button className="btn-register-product" onClick={() => navigate('/admin/products/lowstock')}>Tồn Kho Sắp Hết</button>
            
          </div>
          <form className="product-form" onSubmit={handleSubmit}>
            <div className="input-group-container">
              <div className="input-group">
                <label htmlFor="product-name">Tên Sản Phẩm:</label>
                <input type="text" id="product-name" name="product-name" required />
              </div>
              <div className="input-group">
                <label htmlFor="product-quantity">Số Lượng:</label>
                <input
                  type="number"
                  id="product-quantity"
                  name="product-quantity"
                  value={quantity === 0 ? "" : quantity}
                  onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                  required
                />
              </div>
            </div>
            <div className="input-group-container">
              <div className="input-group">
                <label htmlFor="product-category">Danh Mục:</label>
                <select
                  id="product-category"
                  name="product-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                >
                  <option value="">Chọn Danh Mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="product-price">Giá Tiền:</label>
                <input
                  type="number"
                  id="product-price"
                  name="product-price"
                  value={price === 0 ? "" : price}
                  onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                  required
                />
              </div>
            </div>
            <div className="input-group-container">
              <div className="discount-group">
                <label htmlFor="is-discount">Khuyến Mãi</label>
                <input
                  type="checkbox"
                  id="is-discount"
                  checked={isDiscount}
                  onChange={() => {
                    setIsDiscount(!isDiscount);
                    if (!isDiscount) setDiscountPrice(-1);
                  }}
                />
              </div>
              {isDiscount && (
                <div className="input-group">
                  <label htmlFor="product-discount-price">Giá Khuyến Mãi:</label>
                  <input
                    type="number"
                    id="product-discount-price"
                    name="product-discount-price"
                    value={discountPrice === -1 ? "" : discountPrice}
                    onChange={(e) => setDiscountPrice(Math.max(0, Number(e.target.value)))}
                  />
                </div>
              )}
            </div>
            <div className="input-group full-width">
              <label htmlFor="product-image">Tải Ảnh:</label>
              <input
                type="file"
                id="product-image"
                name="product-image"
                accept="image/*"
              />
            </div>
            <button type="submit" className="submit-btn">
              Thêm Sản Phẩm
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;
