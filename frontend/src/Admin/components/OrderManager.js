import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const OrderManager = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);   const [filteredOrders, setFilteredOrders] = useState([]);   const [loading, setLoading] = useState(true);   const [error, setError] = useState(null); 
    useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders");
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu từ server");
        }
        const data = await response.json();
        setOrders(data);         setFilteredOrders(data);       } catch (err) {
        setError(err.message);       } finally {
        setLoading(false);       }
    };

    fetchOrders();
  }, []); 
    const filterCancelledOrders = () => {
    const cancelled = orders.filter((order) => order.status === "Hủy");
    setFilteredOrders(cancelled);
  };

    const sortByNewest = () => {
    const sorted = [...orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setFilteredOrders(sorted);
  };

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
