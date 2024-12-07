import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HistoryOrder = () => {
  const [orders, setOrders] = useState([]);   const [filteredOrders, setFilteredOrders] = useState([]);   const userId = localStorage.getItem('iduser');   const navigate = useNavigate();

    useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/orders/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setOrders(data);           setFilteredOrders(data);         })
        .catch((error) => console.error('Lỗi khi tải dữ liệu:', error));
    }
  }, [userId]);

    const filterCancelledOrders = () => {
    const cancelledOrders = orders.filter((order) => order.status === 'Đã hủy');
    setFilteredOrders(cancelledOrders);
  };

    const sortByNewest = () => {
    const sortedOrders = [...orders].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;     });
    setFilteredOrders(sortedOrders);   };

  return (
    <div className="dash-content">
      <h2>Lịch Sử Đơn Hàng</h2>

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
          {Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.userInfo?.name || 'Không xác định'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.totalPrice.toLocaleString()} VNĐ</td>
                <td>{order.status}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate('details-order', { state: { orderId: order.orderId } })
                    }
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Không có đơn hàng nào để hiển thị</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryOrder;
