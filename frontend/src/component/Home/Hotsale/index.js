import React, { useState, useEffect } from 'react';

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
    <div className="max-w-[1150px] w-full mx-auto mt-11 bg-orange-400 from-indigo-500 via-purple-500 to-pink-500 shadow-2xl rounded-xl p-6 relative">
      {/* Header HOT SALE */}
      <div className="flex items-center text-white font-bold mb-6 text-2xl hover:text-red-600">
        <i className="fa-solid fa-fire text-3xl animate-bounce mr-3"></i>
        <h2>HOT SALE</h2>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (boxWidth + marginInPixels)}px)`,
          }}
        >
          {hotsaleData.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[250px] mx-2 bg-white shadow-md hover:shadow-lg rounded-lg p-5 flex flex-col items-stretch transition-transform transform hover:-translate-y-1"
            >
              {/* Gắn nhãn giảm giá */}
              <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 text-sm font-semibold rounded-full shadow-md">
                {calculateSale(item.priceOld, item.priceNew)}
              </div>

              {/* Vùng hiển thị hình ảnh */}
              <div className="h-40 flex items-center justify-center rounded-md overflow-hidden">
                {item.imgSrc ? (
                  <img
                    src={require(`${item.imgSrc}`)}
                    alt={item.name}
                    className="h-full w-auto object-contain"
                  />
                ) : (
                  <p className="text-gray-600 text-sm font-semibold">Hình ảnh không khả dụng</p>
                )}
              </div>

              {/* Tên sản phẩm */}
              <a
                href="#"
                className="text-lg font-semibold text-gray-800 mb-2 text-center line-clamp-2 hover:text-orange-600"
              >
                {item.name}
              </a>

              {/* Giá sản phẩm */}
              <div className="flex items-center justify-center text-center space-x-3 mb-3">
                <p className="text-xl font-bold text-red-500">{item.priceNew}</p>
                <p className="text-gray-400 line-through text-sm">{item.priceOld}</p>
              </div>

              {/* Đánh giá sao */}
              <div className="flex justify-center text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fa-solid ${i < 4 ? "fa-star" : "fa-star-half-alt"}`}
                  />
                ))}
              </div>

              {/* Nút mua ngay */}
              <a
                href="#"
                className="bg-red-600 from-pink-500 to-purple-600 text-white font-bold rounded-lg py-2 px-4 text-center hover:shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                Mua Ngay
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Nút điều hướng */}
      <div className="absolute  top-1/2 left-1 transform -translate-y-1/2">
        <i
          className="fa-solid fa-chevron-left text-4xl text-white transition-all"
          onClick={previousSlide}
        />
      </div>
      <div className="absolute top-1/2  right-0 transform -translate-y-1/2">
        <i
          className="fa-solid fa-chevron-right text-4xl text-white transition-all"
          onClick={nextSlide}
        />
      </div>
    </div>
  );
};

export default Hotsale;