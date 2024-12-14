import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ListProduct = () => {
  const location = useLocation();
  const [products, setProducts] = useState(location.state?.filteredProducts || []);
  const [sortOption, setSortOption] = useState('promotion');
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();
  const handleBuyNow = (product) => {
    const userId = localStorage.getItem('iduser'); // Lấy userId từ localStorage

    if (!userId) {
      setNotification('Bạn cần đăng nhập để mua sản phẩm!');
      navigate('/login');
      return; // Dừng nếu user chưa đăng nhập
    }

    axios.post('http://localhost:5000/api/cart/add', {
      userId,
      productId: product.id,
    })
      .then((response) => {
        setNotification('Sản phẩm đã được thêm vào giỏ hàng!');
        setTimeout(() => setNotification(''), 3000);
      })
      .catch((error) => {
        setNotification('Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.');
        setTimeout(() => setNotification(''), 3000);
        console.error('Error adding product to cart:', error);
      });
  };

  // Khi không có state (nhấn "Tất Cả Sản Phẩm"), ta lấy tất cả sản phẩm từ API
  useEffect(() => {
    if (!location.state) {
      axios.get('http://localhost:5000/api/products')
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the product data!", error);
        });
    }
  }, [location.state]);

  // Hàm sắp xếp theo khuyến mãi
  // Hàm sắp xếp theo khuyến mãi
  const sortByPromotion = () => {
    const sortedProducts = [...products].sort((a, b) => {
      // Nếu discountprice = -1, coi như sản phẩm không có khuyến mãi
      const promotionA = a.discountprice === -1 ? -1 : (1 - a.discountprice / a.price) * 100;
      const promotionB = b.discountprice === -1 ? -1 : (1 - b.discountprice / b.price) * 100;

      // Nếu cả 2 sản phẩm đều không có khuyến mãi, thì sắp xếp theo giá
      if (promotionA === -1 && promotionB === -1) {
        return b.price - a.price; // Sắp xếp theo giá
      }

      return promotionB - promotionA; // Sắp xếp theo khuyến mãi
    });
    setProducts(sortedProducts);
  };

  // Hàm sắp xếp theo giá từ thấp đến cao
  const sortByPriceLowToHigh = () => {
    const sortedProducts = [...products].sort((a, b) => {
      const priceA = a.discountprice === -1 ? a.price : a.discountprice;
      const priceB = b.discountprice === -1 ? b.price : b.discountprice;
      return priceA - priceB;
    });
    setProducts(sortedProducts);
  };
  // Hàm sắp xếp theo giá từ cao đến thấp
  const sortByPriceHighToLow = () => {
    const sortedProducts = [...products].sort((a, b) => {
      const priceA = a.discountprice === -1 ? a.price : a.discountprice;
      const priceB = b.discountprice === -1 ? b.price : b.discountprice;
      return priceB - priceA;
    });
    setProducts(sortedProducts);
  };

  // Hàm xử lý thay đổi lựa chọn sắp xếp
  const handleSortChange = (option) => {
    setSortOption(option); // Cập nhật lựa chọn sắp xếp
    if (option === 'promotion') {
      sortByPromotion();
    } else if (option === 'priceLowToHigh') {
      sortByPriceLowToHigh();
    } else if (option === 'priceHighToLow') {
      sortByPriceHighToLow();
    }
  };

  // Mặc định sắp xếp theo khuyến mãi khi trang được tải lần đầu
  useEffect(() => {
    if (sortOption === 'promotion') {
      sortByPromotion();
    }
  }, [sortOption]); // Chỉ gọi lại khi lựa chọn sắp xếp thay đổi

  return (
    <div className="p-6">
      {/* Phần Sắp xếp */}
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <span className="font-semibold text-lg w-full sm:w-auto">Sắp xếp theo</span>
        <div className="flex items-center gap-4 w-full sm:w-auto flex-wrap justify-end">
          <button
            className="flex items-center gap-2 p-2 border rounded shadow-md mb-2 sm:mb-0 w-full sm:w-auto hover:bg-orange-400"
            onClick={() => handleSortChange('priceHighToLow')}
          >
            <i className="fa-solid fa-arrow-down-short-wide"></i> Giá Cao - Thấp
          </button>
          <button
            className="flex items-center gap-2 p-2 border rounded shadow-md mb-2 sm:mb-0 w-full sm:w-auto hover:bg-orange-400"
            onClick={() => handleSortChange('priceLowToHigh')}
          >
            <i className="fa-solid fa-arrow-up-short-wide"></i> Giá Thấp - Cao
          </button>
          <button
            className="flex items-center gap-2 p-2 border rounded shadow-md mb-2 sm:mb-0 w-full sm:w-auto hover:bg-orange-400"
            onClick={() => handleSortChange('promotion')}
          >
            <i className="fa-solid fa-percent"></i> Khuyến Mãi Hot
          </button>
        </div>
      </div>


      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg shadow-lg overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 ease-in-out items-stretch flex-shrink-0 transform hover:-translate-y-1"
          >
            {product.discountprice !== -1 && (
              <div className="absolute mt-2 ml-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 text-sm font-semibold rounded-full shadow-md">
                Giảm {Math.round((1 - product.discountprice / product.price) * 100)}%
              </div>
            )}
            <div className="w-full h-48 overflow-hidden">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-2">
              <div className="text-center font-semibold text-gray-800 line-clamp-2">
                {product.name}
              </div>
              <div className="text-center mt-2">
                {product.discountprice !== -1 ? (
                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    <span className="text-red-600 font-bold text-lg">
                      {product.discountprice.toLocaleString()} đ
                    </span>
                    <span className="line-through text-gray-500 text-sm">
                      {product.price.toLocaleString()} đ
                    </span>
                  </div>

                ) : (
                  <span className="text-red-600 font-bold text-lg">
                    {product.price.toLocaleString()} đ
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center mt-2">
                <i className="fa-solid fa-star text-yellow-400"></i>
                <i className="fa-solid fa-star text-yellow-400"></i>
                <i className="fa-solid fa-star text-yellow-400"></i>
                <i className="fa-solid fa-star text-yellow-400"></i>
                <i className="fa-solid fa-star-half-stroke text-yellow-400"></i>
              </div>
            </div>
            <button
              className="bg-red-600 mb-5 ml-5 mr-5 from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:bg-red-500 py-2 px-4 text-center transition-all"
              onClick={() => handleBuyNow(product)}
            >
              Mua Ngay
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};


export default ListProduct;
