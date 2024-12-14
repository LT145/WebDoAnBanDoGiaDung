import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderId = location.state?.orderId; // Lấy orderId từ state truyền qua

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
        setOrder(data); // Lưu chi tiết đơn hàng
      } catch (err) {
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
      navigate("/profile/history-order"); // Điều hướng về danh sách đơn hàng (nếu cần)
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-2.5 transition-all duration-500 ease-in-out">
      <div id="cart-header" className="p-4 text-center border-b">
        <p className="text-lg font-semibold text-gray-800">Thông Tin Đơn Hàng</p>
        <div className="down" />
      </div>

      {/* Thông tin người nhận */}
      <div className="block-payment mt-4 px-4 mb-10">
        <div className="block-payment__wrapper max-w-3xl mx-auto bg-white shadow-md rounded-lg">
          <div className="block-payment__main p-6">
            <div className="form-row grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Tên người nhận */}
              <div className="box-input">
              <label className="block mb-2 text-sm text-gray-600">Tên người nhận</label>
                <input
                  type="text"
                  placeholder="Tên người nhận"
                  maxLength={100}
                  autoComplete="off"
                  value={order.userInfo.name || ""}
                  className="box-input__main w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  readOnly
                />
              </div>

              {/* Số điện thoại */}
              <div className="box-input">
              <label className="block mb-2 text-sm text-gray-600">Số điện thoại</label>
                <input
                  type="text"
                  placeholder="Số điện thoại người nhận"
                  maxLength={15}
                  autoComplete="off"
                  value={order.userInfo.phone || ""}
                  className="box-input__main w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  readOnly
                />
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="box-input mt-4">
            <label className="block mb-2 text-sm text-gray-600">Địa chỉ</label>
              <input
                type="text"
                placeholder="Địa chỉ người nhận"
                maxLength={200}
                autoComplete="off"
                value={order.address || ""}
                className="box-input__main w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                readOnly
              />
            </div>
          </div>

          {/* Tổng tiền và nút hủy */}
          <div className="block-actions border-t p-4">
            <div className="block-actions__summary mb-4">
              <p className="text-lg font-medium">
                Tổng tiền:{" "}
                <span className="text-red-500 text-right">
                  {calculateTotal()?.toLocaleString("vi-VN")} VND
                </span>
              </p>
            </div>
            <div className="block-actions__buttons flex justify-end">
              {order.status !== "Đã hủy" && (
                <button
                  className="btn-action btn-cancel px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={cancelOrder}
                >
                  Hủy đơn hàng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Hiển thị sản phẩm */}
      <div className="cart-item-wrapper mb-[70px]">
        {order.selectedItems.length === 0 ? (
          <p>Giỏ hàng của bạn hiện tại trống</p>
        ) : (
          order.selectedItems.map((item, index) => {
            const { productDetails, quantity } = item;
            return (
              <div key={index} className="cart-item-container relative flex flex-col gap-5 bg-white rounded-lg p-5 shadow-md shadow-mt mx-auto mb-5 max-w-[600px] overflow-hidden">
                <div className="cart-item flex gap-5 items-center relative min-h-[120px]">
                  <div className="checkbox-product flex items-center gap-5 flex-shrink-0">
                    <img
                      src={productDetails.img || "/img/default-product.jpg"}
                      alt={productDetails.name || "Sản phẩm không có tên"}
                      className="product-img w-[100px] h-[100px] object-cover rounded-md"
                    />
                  </div>
                  <div className="product-info flex-grow">
                    <a className="product-name text-lg font-bold text-gray-800 hover:text-[#F29F41]">
                      {productDetails.name || "Tên sản phẩm không có"}
                    </a>
                    <div className="box-info_box-price flex gap-3 mt-1 justify-between flex-wrap">
                      <p className="product_price--show text-red-600 text-lg">
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
