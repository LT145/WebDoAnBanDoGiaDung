import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stockimport = () => {
  const [categories, setCategories] = useState([]); // Danh sách danh mục
  const [selectedCategory, setSelectedCategory] = useState(''); // Danh mục được chọn
  const [quantity, setQuantity] = useState(0); // Số lượng nhập
  const [newQuantity, setNewQuantity] = useState(0); // Số lượng sau nhập
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm sản phẩm
  const [productSuggestions, setProductSuggestions] = useState([]); // Gợi ý sản phẩm
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Trạng thái của dropdown
  const [productDetails, setProductDetails] = useState(null); // Thông tin chi tiết sản phẩm

  // Lấy danh mục sản phẩm khi component mount
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

  // Lấy gợi ý sản phẩm khi người dùng nhập tên sản phẩm
// Lấy gợi ý sản phẩm khi người dùng nhập tên sản phẩm
useEffect(() => {
    const fetchProductSuggestions = async () => {
      if (searchTerm.length > 0) {
        try {
          const response = await axios.post('http://localhost:5000/api/products/search', {
            name: searchTerm,  // Đảm bảo tên được gửi qua body của request
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
  
  // Xử lý khi người dùng chọn sản phẩm từ danh sách gợi ý
const handleSelectProduct = async (productName) => {
  setSearchTerm(productName); // Cập nhật từ khóa tìm kiếm
  setIsDropdownOpen(false); // Đóng dropdown

  try {
    const response = await axios.get(`http://localhost:5000/api/products/findname/${productName}`);
    const product = response.data;

    if (product) {
      setProductDetails(product); // Lưu tất cả thông tin của sản phẩm vào trạng thái
      setSelectedCategory(product.categoryId); // Cập nhật categoryId của sản phẩm
      setNewQuantity(product.quantity); // Số lượng ban đầu của sản phẩm
    } else {
      console.error('Không tìm thấy sản phẩm');
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sản phẩm:', error);
  }
};

  // Cập nhật số lượng nhập và tính toán số lượng sau khi nhập
  const handleQuantityChange = (e) => {
    const newQuantityValue = Math.max(0, Number(e.target.value));
    setQuantity(newQuantityValue);
    if (productDetails) {
      setNewQuantity(productDetails.quantity + newQuantityValue); // Tính số lượng sau nhập
    }
  };

  // Xử lý submit form để gửi dữ liệu lên server
// Cập nhật lại hàm handleSubmit để chỉ cập nhật số lượng
// Cập nhật lại hàm handleSubmit để chỉ thay đổi số lượng
const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!productDetails) {
      alert('Không có sản phẩm nào để cập nhật');
      return;
    }
  
    // Lấy thông tin sản phẩm cũ
    const updatedProduct = {
      ...productDetails, // Giữ nguyên thông tin cũ
      quantity: newQuantity, // Chỉ cập nhật số lượng
    };
  
    try {
      // Gửi dữ liệu sản phẩm đã cập nhật (chỉ thay đổi số lượng)
      const response = await axios.put(`http://localhost:5000/api/products/${updatedProduct.id}`, updatedProduct);
      alert(response.data.message); // Hiển thị thông báo khi cập nhật thành công
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
