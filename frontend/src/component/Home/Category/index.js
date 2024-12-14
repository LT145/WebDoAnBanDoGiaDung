import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Lấy danh mục từ backend
  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  // Xử lý điều hướng và lọc sản phẩm
  const handleNavigate = (categoryId) => {
    let url = 'http://localhost:5000/api/products';
    if (categoryId) {
      url = `http://localhost:5000/api/products/${categoryId}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        navigate('/listproduct', { state: { filteredProducts: data } });
      })
      .catch((error) => console.error('Error fetching products:', error));
  };

  return (
    <div className="max-w-[1150px] w-full container mx-auto mt-6 p-4 bg-white rounded-2xl shadow-lg">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-200 hover:to-orange-300 rounded-xl p-4 cursor-pointer transition transform hover:scale-105"
            onClick={() => handleNavigate(category.id)}
          >
            <img
              src={category.img}
              alt={category.name}
              className="w-16 h-16 rounded-full shadow-md object-cover"
            />
            <span className="mt-2 text-sm font-medium text-gray-800">
              {category.name}
            </span>
          </div>
        ))}
        {/* Tất Cả Sản Phẩm */}
        <div
          className="flex flex-col items-center bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-300 hover:to-gray-400 rounded-xl p-4 cursor-pointer transition transform hover:scale-105"
          onClick={() => handleNavigate()}
        >
          <i className="fa-solid fa-bars text-3xl text-gray-600" />
          <span className="mt-2 text-sm font-medium text-gray-800">
            Tất Cả Sản Phẩm
          </span>
        </div>
      </div>
    </div>
  );
};

export default Category;
