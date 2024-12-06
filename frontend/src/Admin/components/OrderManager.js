import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const OrderManager = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]); // Danh sách tất cả đơn hàng
  const [filteredOrders, setFilteredOrders] = useState([]); // Danh sách đã lọc hoặc sắp xếp
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders"); // Thay đổi URL nếu cần
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu từ server");
        }
        const data = await response.json();
        setOrders(data); // Lưu dữ liệu vào state
        setFilteredOrders(data); // Hiển thị ban đầu tất cả đơn hàng
      } catch (err) {
        setError(err.message); // Ghi nhận lỗi
      } finally {
        setLoading(false); // Tắt trạng thái tải
      }
    };

    fetchOrders();
  }, []); // Chỉ chạy khi component được mount

  // Hàm lọc đơn hàng đã hủy
  const filterCancelledOrders = () => {
    const cancelled = orders.filter((order) => order.status === "Hủy");
    setFilteredOrders(cancelled);
  };

  // Hàm sắp xếp theo ngày mới nhất
  const sortByNewest = () => {
    const sorted = [...orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setFilteredOrders(sorted);
  };

  // Xử lý nếu đang tải hoặc có lỗi
  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <section className="dashboard">
      <h2>Quản Lý Đơn Hàng</h2>

      {/* Buttons để lọc và sắp xếp */}
      <div className="right">
        <div className="filter-sort__title">Sắp xếp theo</div>
        <div className="filter-sort_list-filter">
          <div
            className="btn-filter button_sort"
            onClick={filterCancelledOrders}
          >
            <i className="fa-solid fa-x" />
            Đơn hàng đã hủy
          </div>
          <div className="btn-filter button_sort" onClick={sortByNewest}>
            <i className="fa-solid fa-calendar-days" />
            Mới Nhất
          </div>
        </div>
      </div>

      {/* Hiển thị bảng đơn hàng */}
      <table className="tableorder">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Khách hàng</th>
            <th>Ngày đặt hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.userInfo.name}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{order.totalPrice.toLocaleString()} VNĐ</td>
              <td>{order.status}</td>
              <td>
                <button 
                  onClick={() => navigate('orderdetail', { state: { orderId: order.orderId } })}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default OrderManager;
