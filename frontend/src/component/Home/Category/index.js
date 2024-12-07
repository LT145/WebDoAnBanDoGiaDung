import React, { useState, useEffect } from 'react';
import './Category.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Category = () => {
  const navigate = useNavigate();   const [categories, setCategories] = useState([]);

    useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

    const handleNavigate = (categoryId) => {
    let url = 'http://localhost:5000/api/products';
    
        if (categoryId) {
      url = `http://localhost:5000/api/products/${categoryId}`;
    }
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
                navigate('/listproduct', { state: { filteredProducts: data } });
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  return (
    <div id="table-container">
      <div className="row">
        {categories.map((category) => (
          <div className="cell" key={category.id} onClick={() => handleNavigate(category.id)}>
            <img src={category.img} alt={category.name} />
            <span>{category.name}</span>
          </div>
        ))}
        {/* Tất Cả Sản Phẩm không có categoryId nên gọi handleNavigate() không truyền tham số */}
        <div className="cell" onClick={() => handleNavigate()}>
          <i className="fa-solid fa-bars" style={{ fontSize: 30, padding: 25 }} />
          <span>Tất Cả Sản Phẩm</span>
        </div>
      </div>
    </div>
  );
};

export default Category;
