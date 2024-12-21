import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // State to store cart items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectAll, setSelectAll] = useState(false); // Checkbox chọn tất cả
  const [selectedItems, setSelectedItems] = useState([]); // Danh sách sản phẩm được chọn

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
        const cartItemsWithDetails = await Promise.all(
          cartData.map(async (item) => {
            const productResponse = await axios.get(
              `http://localhost:5000/api/products/findid/${item.productId}`
            );
            const productDetails = productResponse.data;

            // Lưu số lượng còn lại của sản phẩm
            const quantityAvailable = productDetails.quantity || 0;

            return {
              ...item,
              productDetails,
              quantity: item.quantity || 1, // Số lượng mặc định
              isChecked: false, // Trạng thái checkbox
              quantityAvailable, // Số lượng còn lại
            };
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
    ); // Giới hạn số lượng không vượt quá số lượng còn lại
    updatedItems[index].quantity = newQuantity;
    setCartItems(updatedItems);

    // Gửi request cập nhật số lượng
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
      // Gửi yêu cầu xóa sản phẩm từ giỏ hàng
      await axios.delete("http://localhost:5000/api/cart/remove", {
        data: { userId, productId },
      });

      // Cập nhật lại giỏ hàng sau khi xóa sản phẩm
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
      <div id="cart-header" className="flex items-center justify-between text-center text-2xl text-gray-700 p-4 relative">
        <p className="flex-grow text-center font-bold">Giỏ hàng của bạn</p>
        <div className="down absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-[1px] bg-[#e5e5e5]" />
      </div>

      <div className="cart-item-wrapper mb-[70px]">
        <div className="select-all flex items-center justify-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="mr-2"
          />
          <label className="text-lg text-gray-700">Chọn tất cả</label>
        </div>

        {/* Kiểm tra giỏ hàng có sản phẩm không */}
        {cartItems.length === 0 ? (
          <p className="text-center text-lg">Giỏ hàng của bạn hiện tại trống</p>
        ) : (
          cartItems.map((item, index) => {
            const { productDetails, quantity, isChecked } = item;
            return (
              <div key={index} className="cart-item-container relative flex flex-col gap-5 bg-white rounded-lg p-5 shadow-md shadow-mt mx-auto mb-5 max-w-[600px] overflow-hidden">
                <div className="cart-item flex gap-5 items-center relative min-h-[120px]">
                  <div className="checkbox-product flex items-center gap-5 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={`product-checkbox-${item.productId}`}
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(index)}
                      // className="mr-2"
                    />
                    <label htmlFor={`product-checkbox-${item.productId}`}>
                      <img
                        src={productDetails?.img || "/img/default-product.jpg"}
                        alt={productDetails?.name || "Sản phẩm không có tên"}
                        className="product-img w-[100px] h-[100px] object-cover rounded-md"
                      />
                    </label>
                  </div>

                  <div className="product-info flex-grow">
                    <a href="#" className="product-name text-lg font-bold text-gray-800 hover:text-[#F29F41]">
                      {productDetails?.name || "Tên sản phẩm không có"}
                    </a>
                    <div className="box-info_box-price flex gap-3 mt-1 justify-between flex-wrap">
                      <p className="product_price--show text-red-600 text-lg">
                        {productDetails?.discountprice && productDetails.discountprice !== -1 ? (
                          <span className="product-discountprice">
                            {productDetails.discountprice.toLocaleString("vi-VN")} VND
                          </span>
                        ) : (
                          <span>
                            {productDetails?.price.toLocaleString("vi-VN")} VND
                          </span>
                        )}
                      </p>
                      {productDetails?.discountprice && productDetails.discountprice !== -1 && (
                        <p className="product-original-price text-x line-through text-gray-500">
                          <span>
                            {productDetails.price.toLocaleString("vi-VN")} VND
                          </span>
                        </p>
                      )}
                      <div className="quantity-control mt-10 flex justify-between items-center w-[70px] gap-2 ">
                        <button
                          className="quantity w-[20px] p-0 text-xl bg-orange-400 rounded-2xl"
                          onClick={() => handleQuantityChange(index, -1)}
                          disabled={cartItems[index].quantity <= 1}
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button
                          className="quantity w-[20px] p-0 text-xl bg-orange-400 rounded-2xl"
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
                      <p className="quantity-remaining text-right text-sm text-gray-600">
                        Số lượng còn lại: {cartItems[index].quantityAvailable}
                      </p>
                    )}

                    {/* Thùng rác icon */}
                    <div className="remove-item absolute top-0 right-0 flex items-center justify-end mt-3 mr-2">
                      <i
                        onClick={() => handleRemoveItem(item.productId)}
                        className="fas fa-trash mt-5 text-xl transition-colors duration-300 hover:text-[#E29A34]"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div className="buy flex justify-center items-center">
          <div id="BottomBar" className="flex justify-between items-center bg-white border border-[#919EAB3C] rounded-t-lg shadow-[0_-4px_20px_-1px_rgba(40,124,234,.15)] px-4 py-3 fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] z-11">
            <p className="text-gray-700">
              Tổng tiền:{" "}
              <span className="text-red-600 font-semibold">
                {calculateTotal().toLocaleString("vi-VN")} VND
              </span>
            </p>
            <button
              className="btn-action px-4 py-2 bg-gray-400 text-white rounded-md text-lg hover:bg-orange-400"
              onClick={handleProceedToOrder}
              disabled={selectedItems.length === 0}
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>


  );
};

export default Cart;
