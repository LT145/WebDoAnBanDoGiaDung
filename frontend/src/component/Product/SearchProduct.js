import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(location.state?.searchQuery || '');
  const [notification, setNotification] = useState('');
  const [sortOption, setSortOption] = useState('promotion');

  // Fetch products based on search query
  const fetchProducts = async (query) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/search?name=${encodeURIComponent(query)}`
      );
      if (response.data.length === 0) {
        setProducts([]);
      } else {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Cũng đặt sản phẩm thành rỗng nếu có lỗi
    }
  };
  useEffect(() => {
    if (searchQuery) {
      fetchProducts(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
  }, [location.state]);

  const handleBuyNow = (product) => {
    const userId = localStorage.getItem('iduser');

    if (!userId) {
      setNotification('Bạn cần đăng nhập để mua sản phẩm!');
      navigate('/login');
      return;
    }

    axios
      .post('http://localhost:5000/api/cart/add', {
        userId,
        productId: product.id,
      })
      .then(() => {
        setNotification('Sản phẩm đã được thêm vào giỏ hàng!');
        setTimeout(() => setNotification(''), 3000);
      })
      .catch(() => {
        setNotification('Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.');
        setTimeout(() => setNotification(''), 3000);
      });
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    const sortedProducts = [...products];
    if (option === 'promotion') {
      sortedProducts.sort((a, b) => {
        const promotionA = a.discountprice === -1 ? -1 : (1 - a.discountprice / a.price) * 100;
        const promotionB = b.discountprice === -1 ? -1 : (1 - b.discountprice / b.price) * 100;
        return promotionB - promotionA;
      });
    } else if (option === 'priceLowToHigh') {
      sortedProducts.sort((a, b) => {
        const priceA = a.discountprice === -1 ? a.price : a.discountprice;
        const priceB = b.discountprice === -1 ? b.price : b.discountprice;
        return priceA - priceB;
      });
    } else if (option === 'priceHighToLow') {
      sortedProducts.sort((a, b) => {
        const priceA = a.discountprice === -1 ? a.price : a.discountprice;
        const priceB = b.discountprice === -1 ? b.price : b.discountprice;
        return priceB - priceA;
      });
    }
    setProducts(sortedProducts);
  };

  return (
    <div className="p-6">
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

      {products.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          Không tìm thấy sản phẩm nào với từ khóa "<span className="font-bold">{searchQuery}</span>".
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default SearchProduct;
