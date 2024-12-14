import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HistoryOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const userId = localStorage.getItem('iduser');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/orders/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setOrders(data);
          setFilteredOrders(data);
        })
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
      return dateB - dateA;
    });
    setFilteredOrders(sortedOrders);
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-2.5 transition-all duration-500 ease-in-out">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Lịch Sử Đơn Hàng</h2>

      <div className="flex justify-between mb-6">
        <div className="flex gap-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
            onClick={filterCancelledOrders}
          >
            <i className="fa-solid fa-x mr-2" />
            Đơn hàng đã hủy
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            onClick={sortByNewest}
          >
            <i className="fa-solid fa-calendar-days mr-2" />
            Mới Nhất
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-6 py-3 text-left">Mã đơn hàng</th>
              <th className="px-6 py-3 text-left">Khách hàng</th>
              <th className="px-6 py-3 text-left">Ngày đặt hàng</th>
              <th className="px-6 py-3 text-left">Tổng tiền</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.orderId} className="border-t border-gray-200">
                  <td className="px-6 py-4 truncate">{order.orderId}</td> {/* Thêm class 'truncate' */}
                  <td className="px-6 py-4 truncate">{order.userInfo?.name || 'Không xác định'}</td> {/* Thêm class 'truncate' */}
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{order.totalPrice.toLocaleString()} VNĐ</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block py-1 px-3 rounded-full text-white whitespace-nowrap ${order.status === 'Đã hủy' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                    >
                      {order.status}
                    </span>

                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        navigate('details-order', { state: { orderId: order.orderId } })
                      }
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none whitespace-nowrap"
                    >
                      Xem chi tiết
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">Không có đơn hàng nào để hiển thị</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryOrder;
