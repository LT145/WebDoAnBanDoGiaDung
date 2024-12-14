import React from 'react';
import './NameProduct.css';
const NameProduct = () => {
    return (
        <div id="product">
            <div className="name">
                <h2>Máy giặt Panasonic 8.5 Kg NA-F85A9BRV</h2>
            </div>
            <div className="detail">
                <div className="star">
                    <i className="fa-solid fa-star" />
                    <a href="">4.5(756)</a>
                </div>
                <div className="thongso">
                    <i className="fa-solid fa-ruler-combined" />
                    <a href="">Thông số</a>
                </div>
                <div className="compare">
                    <i className="fa-solid fa-circle-plus" />
                    <a href="">So sánh</a>
                </div>
            </div>
        </div>

    );
  }
  
  export default NameProduct;
  