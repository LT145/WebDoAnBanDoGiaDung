import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderId = location.state?.orderId; 
  useEffect(() => {
    if (!orderId) {
      setError("Không tìm thấy mã đơn hàng.");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/${orderId}`
        );
        if (!response.ok) {
          throw new Error("Không thể lấy thông tin đơn hàng.");
        }
        const data = await response.json();
        setOrder(data);       } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const calculateTotal = () =>
    order?.selectedItems.reduce((total, item) => {
      const price =
        item.productDetails.discountprice &&
        item.productDetails.discountprice !== -1
          ? item.productDetails.discountprice
          : item.productDetails.price;
      return total + price * item.quantity;
    }, 0);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;
  if (!order) return <p>Không tìm thấy đơn hàng.</p>;
  const cancelOrder = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể hủy đơn hàng.");
      }

      const data = await response.json();
      console.log(data.message);
      alert("Đơn hàng đã được hủy thành công!");
      navigate("/profile/history-order");     } catch (err) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  return (
    <div className="dash-content">
      <div id="cart-header">
        <p>Thông Tin Đơn Hàng</p>
        <div className="down" />
      </div>

      {/* Thông tin người nhận */}
      <div className="block-payment">
        <div className="block-payment__wrapper">
          <div className="block-payment__main">
            <div className="form-row">
              <div className="box-input">
                <input
                  type="text"
                  placeholder="Tên người nhận"
                  maxLength={100}
                  autoComplete="off"
                  value={order.userInfo.name || ""}
                  className="box-input__main"
                  readOnly
                />
                <label>Tên người nhận</label>
                <div className="box-input__line" />
              </div>
              <div className="box-input">
                <input
                  type="text"
                  placeholder="Số điện thoại người nhận"
                  maxLength={15}
                  autoComplete="off"
                  value={order.userInfo.phone || ""}
                  className="box-input__main"
                  readOnly
                />
                <label>Số điện thoại</label>
                <div className="box-input__line" />
              </div>
            </div>
            <div className="box-input">
              <input
                type="text"
                placeholder="Địa chỉ người nhận"
                maxLength={200}
                autoComplete="off"
                value={order.address || ""}
                className="box-input__main"
                readOnly
              />
              <label>Địa chỉ</label>
              <div className="box-input__line" />
            </div>
          </div>
          <div className="block-actions">
            <div className="block-actions__summary">
              <p>
                Tổng tiền:{" "}
                <span>{calculateTotal()?.toLocaleString("vi-VN")} VND</span>
              </p>
            </div>
            <div className="block-actions__buttons">
              {order.status !== "Đã hủy" && (
                <button className="btn-action btn-cancel" onClick={cancelOrder}>
                  Hủy đơn hàng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hiển thị sản phẩm */}
      <div className="cart-item-wrapper">
        {order.selectedItems.length === 0 ? (
          <p>Giỏ hàng của bạn hiện tại trống</p>
        ) : (
          order.selectedItems.map((item, index) => {
            const { productDetails, quantity } = item;
            return (
              <div key={index} className="cart-item-container">
                <div className="cart-item">
                  <div className="checkbox-product">
                    <img
                      src={productDetails.img || "/img/default-product.jpg"}
                      alt={productDetails.name || "Sản phẩm không có tên"}
                      className="product-img"
                    />
                  </div>
                  <div className="product-info">
                    <a className="product-name">
                      {productDetails.name || "Tên sản phẩm không có"}
                    </a>
                    <div className="box-info_box-price">
                      <p className="product_price--show">
                        {productDetails.discountprice &&
                        productDetails.discountprice !== -1 ? (
                          <span className="product-discountprice">
                            {productDetails.discountprice.toLocaleString(
                              "vi-VN"
                            )}{" "}
                            VND
                          </span>
                        ) : (
                          <span>
                            {productDetails.price.toLocaleString("vi-VN")} VND
                          </span>
                        )}
                      </p>
                      <div className="quantity-show">
                        Số lượng: <span>{quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Hiển thị tổng tiền và nút hành động */}
    </div>
  );
};

export default OrderDetails;
