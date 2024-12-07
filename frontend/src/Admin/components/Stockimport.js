import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stockimport = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [newQuantity, setNewQuantity] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
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

  useEffect(() => {
    const fetchProductSuggestions = async () => {
      if (searchTerm.length > 0) {
        try {
          const response = await axios.post('http://localhost:5000/api/products/search', {
            name: searchTerm,
          });
          setProductSuggestions(response.data);
        } catch (error) {
          console.error('Lỗi khi tìm kiếm sản phẩm:', error);
        }
      } else {
        setProductSuggestions([]);
      }
    };

    fetchProductSuggestions();
  }, [searchTerm]);

  const handleSelectProduct = async (productName) => {
    setSearchTerm(productName); setIsDropdownOpen(false);
    try {
      const response = await axios.get(`http://localhost:5000/api/products/findname/${productName}`);
      const product = response.data;

      if (product) {
        setProductDetails(product); setSelectedCategory(product.categoryId); setNewQuantity(product.quantity);
      } else {
        console.error('Không tìm thấy sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin sản phẩm:', error);
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantityValue = Math.max(0, Number(e.target.value));
    setQuantity(newQuantityValue);
    if (productDetails) {
      setNewQuantity(productDetails.quantity + newQuantityValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productDetails) {
      alert('Không có sản phẩm nào để cập nhật');
      return;
    }

    const updatedProduct = {
      ...productDetails, quantity: newQuantity,
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/products/${updatedProduct.id}`, updatedProduct);
      alert(response.data.message);
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
      alert('Cập nhật số lượng sản phẩm thất bại. Vui lòng thử lại.');
    }
  };



  return (
    <section className="dashboard">
      <div className="dash-content">
        <div className="product-management">
          <div className="title">
            <i className="fa-solid fa-box" />
            <span className="text">Nhập Hàng</span>
          </div>
          <form className="product-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="product-name">Tên Sản Phẩm:</label>
              <div className="input-dropdown">
                <input
                  type="text"
                  id="product-name"
                  name="product-name"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  required
                />
                {isDropdownOpen && productSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {productSuggestions.map((product) => (
                      <li key={product.id} onClick={() => handleSelectProduct(product.name)}>
                        {product.name}
                      </li>
                    ))}
                  </ul>
                )}
                {isDropdownOpen && searchTerm.length > 0 && productSuggestions.length === 0 && (
                  <div className="no-suggestions">Không có sản phẩm này</div>
                )}
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="product-category">Danh Mục:</label>
              <input
                type="text"
                id="product-category"
                name="product-category"
                value={
                  productDetails
                    ? categories.find((cat) => cat.id === selectedCategory)?.name
                    : ''
                }
                readOnly
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="product-quantity">Số Lượng Nhập:</label>
              <input
                type="number"
                id="product-quantity"
                name="product-quantity"
                value={quantity === 0 ? '' : quantity}
                onChange={handleQuantityChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="product-new-quantity">Số Lượng Sau Nhập:</label>
              <input
                type="number"
                id="product-new-quantity"
                name="product-new-quantity"
                value={newQuantity === 0 ? '' : newQuantity}
                readOnly
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Nhập Hàng
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Stockimport;
