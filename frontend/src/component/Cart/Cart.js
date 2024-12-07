import React, { useState, useEffect } from "react";
import axios from "axios";
import "./cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);   const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectAll, setSelectAll] = useState(false);   const [selectedItems, setSelectedItems] = useState([]); 
  const navigate = useNavigate();
  const userId = localStorage.getItem("iduser");
  console.log(userId);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("Chưa đăng nhập. Vui lòng đăng nhập để xem giỏ hàng.");
      return;
    }

    const fetchCart = async () => {
      try {
        const cartResponse = await axios.get(
          `http://localhost:5000/api/cart?userId=${userId}`
        );
        const cartData = cartResponse.data;

                if (cartData.length === 0) {
          setError("Giỏ hàng của bạn hiện tại trống");
        }

                const cartItemsWithDetails = await Promise.all(
          cartData.map(async (item) => {
            const productResponse = await axios.get(
              `http://localhost:5000/api/products/findid/${item.productId}`
            );
            const productDetails = productResponse.data;

                        const quantityAvailable = productDetails.quantity || 0;

            return {
              ...item,
              productDetails,
              quantity: item.quantity || 1,               isChecked: false,               quantityAvailable,             };
          })
        );

        setCartItems(cartItemsWithDetails);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cart or product details:", err);
        setError("Lỗi khi lấy giỏ hàng");
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  const handleSelectAll = () => {
    const updatedItems = cartItems.map((item) => ({
      ...item,
      isChecked: !selectAll,
    }));
    setCartItems(updatedItems);
    setSelectAll(!selectAll);
    setSelectedItems(!selectAll ? updatedItems : []);
  };

  const handleCheckboxChange = (index) => {
    const updatedItems = [...cartItems];
    updatedItems[index].isChecked = !updatedItems[index].isChecked;
    setCartItems(updatedItems);

    const selected = updatedItems.filter((item) => item.isChecked);
    setSelectedItems(selected);
    setSelectAll(selected.length === updatedItems.length);
  };

  const handleQuantityChange = (index, delta) => {
    const updatedItems = [...cartItems];
    const newQuantity = Math.max(
      1,
      Math.min(
        updatedItems[index].quantity + delta,
        updatedItems[index].quantityAvailable
      )
    );     updatedItems[index].quantity = newQuantity;
    setCartItems(updatedItems);

        updateQuantityInBackend(updatedItems[index].productId, newQuantity);
  };

  const updateQuantityInBackend = async (productId, quantity) => {
    try {
      await axios.put("http://localhost:5000/api/cart/update", {
        userId,
        productId,
        quantity,
      });
    } catch (err) {
      console.error("Error updating quantity in backend:", err);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
            await axios.delete("http://localhost:5000/api/cart/remove", {
        data: { userId, productId },
      });

            setCartItems(cartItems.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const calculateTotal = () =>
    selectedItems.reduce(
      (total, item) =>
        total +
        (item.productDetails?.discountprice &&
        item.productDetails.discountprice !== -1
          ? item.productDetails.discountprice
          : item.productDetails.price) *
          item.quantity,
      0
    );

  const handleProceedToOrder = () => {
    navigate("/order", {
      state: {
        selectedItems,
      },
    });
  };

  if (loading) {
    return <p>Đang tải giỏ hàng...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div id="cart-header">
        <p>Giỏ hàng của bạn</p>
        <div className="down" />
      </div>

      <div className="cart-item-wrapper">
        <div className="select-all">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <label>Chọn tất cả</label>
        </div>

        {/* Kiểm tra giỏ hàng có sản phẩm không */}
        {cartItems.length === 0 ? (
          <p>Giỏ hàng của bạn hiện tại trống</p>
        ) : (
          cartItems.map((item, index) => {
            const { productDetails, quantity, isChecked } = item;
            return (
              <div key={index} className="cart-item-container">
                <div className="cart-item">
                  <div className="checkbox-product">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={`product-checkbox-${item.productId}`}
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    <label htmlFor={`product-checkbox-${item.productId}`}>
                      <img
                        src={productDetails?.img || "/img/default-product.jpg"}
                        alt={productDetails?.name || "Sản phẩm không có tên"}
                        className="product-img"
                      />
                    </label>
                  </div>
                  <div className="product-info">
                    <a href="#" className="product-name">
                      {productDetails?.name || "Tên sản phẩm không có"}
                    </a>
                    <div className="box-info_box-price">
                      <p className="product_price--show">
                        {productDetails?.discountprice &&
                        productDetails.discountprice !== -1 ? (
                          <span className="product-discountprice">
                            {productDetails.discountprice.toLocaleString(
                              "vi-VN"
                            )}{" "}
                            VND
                          </span>
                        ) : (
                          <span>
                            {productDetails?.price.toLocaleString("vi-VN")}{" "}
                            VND
                          </span>
                        )}
                      </p>
                      {productDetails?.discountprice &&
                        productDetails.discountprice !== -1 && (
                          <p className="product-original-price">
                            <span>
                              {productDetails.price.toLocaleString("vi-VN")}{" "}
                              VND
                            </span>
                          </p>
                        )}

                      <div className="quantity-control">
                        <button
                          className="quantity"
                          onClick={() => handleQuantityChange(index, -1)}
                          disabled={cartItems[index].quantity <= 1}
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button
                          className="quantity"
                          onClick={() => handleQuantityChange(index, 1)}
                          disabled={
                            cartItems[index].quantity >=
                              cartItems[index].quantityAvailable ||
                            cartItems[index].quantityAvailable <= 0
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {cartItems[index].quantityAvailable <= 5 && (
                      <p className="quantity-remaining">
                        Số lượng còn lại: {cartItems[index].quantityAvailable}
                      </p>
                    )}

                    {/* Thùng rác icon */}
                    <div className="remove-item">
                      <i
                        onClick={() => handleRemoveItem(item.productId)}
                        className="fas fa-trash"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div className="buy">
          <div id="BottomBar">
            <p>
              Tổng tiền:{" "}
              <span>{calculateTotal().toLocaleString("vi-VN")} VND</span>
            </p>
            <button
              className="btn-action"
              onClick={handleProceedToOrder}
              disabled={selectedItems.length === 0}             >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
