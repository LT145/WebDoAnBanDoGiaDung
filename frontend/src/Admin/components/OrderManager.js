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
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;

  return (
    <section className="flex-1 bg-white min-h-screen p-2.5 transition-all duration-500 ease-in-out">
      <h2 className="text-2xl font-semibold mb-4">Quản Lý Đơn Hàng</h2>

      {/* Buttons để lọc và sắp xếp */}
      <div className="mb-4">
        <div className="text-lg font-medium mb-2">Sắp xếp theo</div>
        <div className="flex space-x-4">
          <button
            className="btn-filter bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all"
            onClick={filterCancelledOrders}
          >
            <i className="fa-solid fa-x mr-2" />
            Đơn hàng đã hủy
          </button>
          <button
            className="btn-filter bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
            onClick={sortByNewest}
          >
            <i className="fa-solid fa-calendar-days mr-2" />
            Mới Nhất
          </button>
        </div>
      </div>

      {/* Hiển thị bảng đơn hàng */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-blue-500">
            <tr className="border-b border-gray-300">
              <th className="py-2 px-4 text-left font-semibold text-white">Mã đơn hàng</th>
              <th className="py-2 px-4 text-left font-semibold text-white">Khách hàng</th>
              <th className="py-2 px-4 text-left font-semibold text-white">Ngày đặt hàng</th>
              <th className="py-2 px-4 text-left font-semibold text-white">Tổng tiền</th>
              <th className="py-2 px-4 text-left font-semibold text-white">Trạng thái</th>
              <th className="py-2 px-4 text-left font-semibold text-white">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderId} className="border-b border-gray-300">
                <td className="py-2 px-4">{order.orderId}</td>
                <td className="py-2 px-4">{order.userInfo.name}</td>
                <td className="py-2 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4">{order.totalPrice.toLocaleString()} VNĐ</td>
                <td className="py-2 px-4 ">{order.status}</td>
                <td className="py-2 px-4">
                  <button
                    className="btn-view bg-orange-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-600 transition-all"
                    onClick={() => navigate('orderdetail', { state: { orderId: order.orderId } })}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OrderManager;
