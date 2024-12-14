import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [categories, setCategories] = useState([]); // State để lưu danh mục
  const [selectedCategory, setSelectedCategory] = useState(''); // State để lưu danh mục đã chọn
  const [quantity, setQuantity] = useState(0); // State để lưu số lượng sản phẩm
  const [isDiscount, setIsDiscount] = useState(false); // State để kiểm tra khuyến mãi
  const [price, setPrice] = useState(0); // State để lưu giá tiền
  const [discountPrice, setDiscountPrice] = useState(-1); // Giá khuyến mãi mặc định là -1

  // Gọi API để lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data); // Lưu danh mục vào state
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu danh mục:', error);
      }
    };

    fetchCategories();
  }, []);

  // Xử lý khi người dùng submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const priceValue = Number(price); // Chuyển price thành số
    const quantityValue = Number(quantity); // Chuyển quantity thành số

    const formData = new FormData();
    formData.append('product-name', e.target['product-name'].value);
    formData.append('product-quantity', quantityValue); // Sử dụng số lượng đã chuyển thành số
    formData.append('product-category', selectedCategory);
    formData.append('product-price', priceValue);  // Sử dụng giá trị đã chuyển thành số
    formData.append('is-discount', isDiscount);

    // Chỉ thêm giá khuyến mãi nếu có
    if (isDiscount && discountPrice > 0) {
      formData.append('product-discount-price', discountPrice);  // Sử dụng giá trị đã chuyển thành số
    }

    formData.append('product-image', e.target['product-image'].files[0]); // Thêm ảnh vào FormData

    try {
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Đảm bảo gửi đúng content type cho file upload
        },
      });
      alert(response.data.message); // Hiển thị thông báo thành công
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      alert('Thêm sản phẩm thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <section className="dashboard px-6 py-8">
      <div className="top flex justify-between items-center mb-6">
        <div className="search-box flex items-center space-x-2">
          <i className="fa-solid fa-magnifying-glass text-gray-500" />
          <input type="text" placeholder="Search...." className="border-b-2 py-1 px-2 focus:outline-none" />
        </div>
      </div>
      <div className="dash-content">
        <div className="product-management bg-white shadow-md rounded-lg p-6">
          <div className="title flex items-center space-x-2 mb-6">
            <i className="fa-solid fa-box text-xl text-gray-700" />
            <span className="text-2xl font-semibold">Quản Lý Sản Phẩm</span>
          </div>
          <form className="product-form grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div className="input-group-container grid grid-cols-1 gap-4">
              <div className="input-group">
                <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">Tên Sản Phẩm:</label>
                <input type="text" id="product-name" name="product-name" className="mt-2 p-2 border border-gray-300 rounded-md w-full" required />
              </div>
              <div className="input-group">
                <label htmlFor="product-quantity" className="block text-sm font-medium text-gray-700">Số Lượng:</label>
                <input
                  type="number"
                  id="product-quantity"
                  name="product-quantity"
                  value={quantity === 0 ? "" : quantity}
                  onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
            </div>
            <div className="input-group-container grid grid-cols-1 gap-4">
              <div className="input-group">
                <label htmlFor="product-category" className="block text-sm font-medium text-gray-700">Danh Mục:</label>
                <select
                  id="product-category"
                  name="product-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
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
                <label htmlFor="product-price" className="block text-sm font-medium text-gray-700">Giá Tiền:</label>
                <input
                  type="number"
                  id="product-price"
                  name="product-price"
                  value={price === 0 ? "" : price}
                  onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
            </div>
            <div className="input-group-container grid grid-cols-1 gap-4">
              <div className="discount-group flex items-center space-x-2">
                <label htmlFor="is-discount" className="text-sm font-medium text-gray-700">Khuyến Mãi</label>
                <input
                  type="checkbox"
                  id="is-discount"
                  checked={isDiscount}
                  onChange={() => {
                    setIsDiscount(!isDiscount);
                    if (!isDiscount) setDiscountPrice(-1); // Reset giá khuyến mãi khi bỏ chọn
                  }}
                />
              </div>
              {isDiscount && (
                <div className="input-group">
                  <label htmlFor="product-discount-price" className="block text-sm font-medium text-gray-700">Giá Khuyến Mãi:</label>
                  <input
                    type="number"
                    id="product-discount-price"
                    name="product-discount-price"
                    value={discountPrice === -1 ? "" : discountPrice}
                    onChange={(e) => setDiscountPrice(Math.max(0, Number(e.target.value)))}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
              )}
            </div>
            <div className="input-group full-width">
              <label htmlFor="product-image" className="block text-sm font-medium text-gray-700">Tải Ảnh:</label>
              <input
                type="file"
                id="product-image"
                name="product-image"
                accept="image/*"
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mt-6 flex justify-center">
              <button type="submit" className="submit-btn bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition-all">
                Thêm Sản Phẩm
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;
