import React, { useEffect, useState } from 'react';
import './Product.css'

function ProductTable() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="product_container">
      <h3>Gợi ý sản phẩm</h3>
      <div className="product_row">
        {products.map(product => (
          <div className="product_box" key={product.id}>
            <div className="sale">{product.sale}</div>
            <img src={require(`${product.imgSrc}`)} alt={product.name} />
            <a href="#" className="name">{product.name}</a>
            <div className="money_sale">
              <p className="gia_1">{product.priceNew}</p>
              <p className="gia_2">{product.priceOld}</p>
            </div>
            <div className="star">
              {Array.from({ length: Math.floor(product.rating) }, (_, i) => (
                <i key={i} className="fa-solid fa-star" />
              ))}
            </div>
            <a href="#" className="buy">Mua Ngay</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductTable;
