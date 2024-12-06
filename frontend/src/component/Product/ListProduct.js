import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './ListProduct.css';

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
    <div>
      <div className="filter-sort">
        <div className="filter-sort__title">Sắp xếp theo</div>
        <div className="filter-sort_list-filter">
          <div 
            className="btn-filter button_sort"
            onClick={() => handleSortChange('priceHighToLow')}
          >
            <i className="fa-solid fa-arrow-down-short-wide" />
            Giá Cao - Thấp
          </div>
          <div 
            className="btn-filter button_sort"
            onClick={() => handleSortChange('priceLowToHigh')}
          >
            <i className="fa-solid fa-arrow-down-short-wide" />
            Giá Thấp - Cao
          </div>
          <div 
            className="btn-filter button_sort"
            onClick={() => handleSortChange('promotion')}
          >
            <i className="fa-solid fa-percent" />
            Khuyến Mãi Hot
          </div>
        </div>
      </div>

      <div className="productlist_container">
        {products.map((product) => (
          <div className="product_box" key={product.id}>
            {/* Chỉ hiển thị giảm giá khi discountprice khác -1 */}
            {product.discountprice !== -1 && (
              <div className="sale">
                Giảm {Math.round((1 - product.discountprice / product.price) * 100)}%
              </div>
            )}
            <img src={product.img} alt={product.name} />
            <div className="name">{product.name}</div>
            <div className="money_sale">
              {/* Hiển thị discountprice nếu khác -1, nếu không thì chỉ hiển thị price */}
              {product.discountprice !== -1 ? (
                <>
                  <p className="gia_1">{product.discountprice.toLocaleString()} đ</p>
                  <p className="gia_2">{product.price.toLocaleString()} đ</p>
                </>
              ) : (
                <p className="gia_1">{product.price.toLocaleString()} đ</p>
              )}
            </div>
            <div className="star">
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star-half-stroke" />
            </div>
            <div className="buy" onClick={() => handleBuyNow(product)}>Mua Ngay</div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
