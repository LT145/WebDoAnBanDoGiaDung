import React, { useState, useEffect } from 'react';
import './Hotsale.css';

const Hotsale = () => {
  const [hotsaleData, setHotsaleData] = useState([]); // Khởi tạo state để lưu dữ liệu Hotsale
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchHotsales = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hotsales'); // Lấy dữ liệu từ backend
        const data = await response.json();
        setHotsaleData(data); // Cập nhật state với dữ liệu lấy được
      } catch (error) {
        console.error('Error fetching hotsales:', error);
      }
    };

    fetchHotsales();
  }, []); // Chạy một lần khi component mount

  const totalItems = hotsaleData.length;

  const boxWidth = 250;
  const marginInPixels = 15;
  const itemsPerSlide = Math.floor((window.innerWidth - 20) / (boxWidth + marginInPixels * 2));

  const nextSlide = () => {
    if (currentIndex < totalItems - itemsPerSlide) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const previousSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  const calculateSale = (priceOld, priceNew) => {
    const oldPrice = parseInt(priceOld.replace(/\./g, '').replace(' đ', ''));
    const newPrice = parseInt(priceNew.replace(/\./g, '').replace(' đ', ''));
    const discount = ((oldPrice - newPrice) / oldPrice) * 100;
    return `Giảm ${Math.round(discount)}%`;
  };

  return (
    <div id="hot_sale">
      <div className="fire">
        <i className="fa-solid fa-fire" />
        <h2>HOT SALE</h2>
      </div>
      <div className="body_box">
        <div
          className="box_container"
          style={{ transform: `translateX(-${(currentIndex * (boxWidth + marginInPixels))}px)` }}
        >
          {hotsaleData.map((item, index) => (
            <div className="box" key={index}>
              <div className="sale">{calculateSale(item.priceOld, item.priceNew)}</div>
              <img src={require(`${item.imgSrc}`)} alt={item.name} />
              <a href="#" className="name">
                {item.name}
              </a>
              <div className="money_sale">
                <p className="gia_1">{item.priceNew}</p>
                <p className="gia_2">{item.priceOld}</p>
              </div>
              <div className="star">
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star-half-stroke" />
              </div>
              <a href="#" className="buy">Mua Ngay</a>
            </div>
          ))}
        </div>
      </div>
      <div className="chevron">
        <i className="fa-solid arrow fa-chevron-left" onClick={previousSlide} />
        <i className="fa-solid arrow fa-chevron-right" onClick={nextSlide} />
      </div>
    </div>
  );
};

export default Hotsale;