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
    const userId = localStorage.getItem('iduser');     
    if (!userId) {
      setNotification('Bạn cần đăng nhập để mua sản phẩm!');
      navigate('/login');
      return;     }
  
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

    const sortByPromotion = () => {
  const sortedProducts = [...products].sort((a, b) => {
        const promotionA = a.discountprice === -1 ? -1 : (1 - a.discountprice / a.price) * 100;
    const promotionB = b.discountprice === -1 ? -1 : (1 - b.discountprice / b.price) * 100;
    
        if (promotionA === -1 && promotionB === -1) {
      return b.price - a.price;     }

    return promotionB - promotionA;   });
  setProducts(sortedProducts);
};

    const sortByPriceLowToHigh = () => {
    const sortedProducts = [...products].sort((a, b) => {
      const priceA = a.discountprice === -1 ? a.price : a.discountprice;
      const priceB = b.discountprice === -1 ? b.price : b.discountprice;
      return priceA - priceB;
    });
    setProducts(sortedProducts);
  };

    const sortByPriceHighToLow = () => {
    const sortedProducts = [...products].sort((a, b) => {
      const priceA = a.discountprice === -1 ? a.price : a.discountprice;
      const priceB = b.discountprice === -1 ? b.price : b.discountprice;
      return priceB - priceA;
    });
    setProducts(sortedProducts);
  };

    const handleSortChange = (option) => {
    setSortOption(option);     if (option === 'promotion') {
      sortByPromotion();
    } else if (option === 'priceLowToHigh') {
      sortByPriceLowToHigh();
    } else if (option === 'priceHighToLow') {
      sortByPriceHighToLow();
    }
  };

    useEffect(() => {
    if (sortOption === 'promotion') {
      sortByPromotion();
    }
  }, [sortOption]); 
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
