import React, { useState } from 'react';
import './BoxProduct.css';
const BoxProduct = () => {
    const images = [
        require('./img/panasonic.jpg'),
        require('./img/2.jpg'),
        require('./img/3.jpg'),
        require('./img/4.jpg'),
        require('./img/5.jpg'),
        require('./img/6.jpg'),
        require('./img/7.jpg'),
        require('./img/8.jpg'),
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevClick = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };
  
    const handleNextClick = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    };
    return (
        <div id="box-main">
      <div id="img_product">
        <div className="image-container">
          <i
            className="fa-solid fa-circle-left prev"
            onClick={handlePrevClick}
          ></i>
          {images.map((src, index) => (
  index === currentIndex && (
    <img
      key={index}
      src={src}
      alt="Máy giặt"
      className="main-image active"
    />
  )
))}
          <i
            className="fa-solid fa-circle-right next"
            onClick={handleNextClick}
          ></i>
        </div>
      </div>  
</div>

    );
  }
  
  export default BoxProduct;
  