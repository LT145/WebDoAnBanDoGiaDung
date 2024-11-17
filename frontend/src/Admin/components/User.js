import React, { useState, useEffect } from 'react';

const User = () => {
  const [customers, setCustomers] = useState([]);

  // Gọi API để lấy danh sách người dùng từ backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        // Lọc ra những người có role là "user"
        const userRoleData = data.filter(user => user.role === 'user');
        // Chuyển đổi trạng thái từ 0,1 thành "Hoạt Động" hoặc "Khóa"
        const updatedData = userRoleData.map(user => ({
          ...user,
          status: user.status === 1 ? 'Hoạt Động' : 'Khóa', // Convert 1 to "Hoạt Động" and 0 to "Khóa"
        }));
        setCustomers(updatedData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
      }
    };

    fetchUsers();
  }, []);

  // Hàm cập nhật trạng thái của khách hàng
  const toggleStatus = async (index, userId) => {
    const currentStatus = customers[index].status;
    const newStatus = currentStatus === 'Hoạt Động' ? 0 : 1; // Dùng 0 và 1 thay vì "Hoạt Động" và "Khóa"

    try {
      // Gửi yêu cầu cập nhật trạng thái đến backend
      const response = await fetch(`http://localhost:5000/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Cập nhật trạng thái trong frontend nếu thành công
        const updatedCustomers = [...customers];
        updatedCustomers[index].status = newStatus === 1 ? 'Hoạt Động' : 'Khóa'; // Convert 1 và 0 về trạng thái hiển thị
        setCustomers(updatedCustomers);
      } else {
        console.error('Lỗi khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  return (
    <section className="dashboard">
      <div className="top">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass" />
          <input type="text" placeholder="Search...." />
        </div>
      </div>
      <div className="dash-content">
        <div className="overview">
          <div className="title">
            <i className="fa-solid fa-users" />
            <span className="text">Quản Lý Đăng Nhập Khách Hàng</span>
          </div>
          {/* Bảng thông tin khách hàng */}
          <div className="customer-table">
            <table>
              <thead>
                <tr>
                  <th>Họ Tên</th>
                  <th>Số Điện Thoại</th>
                  <th>Tên Tài Khoản</th>
                  <th>Mật Khẩu</th>
                  <th>Email</th>
                  <th>Trạng Thái</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={index}>
                    <td>{customer.name}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.username}</td>
                    <td>{customer.password}</td>
                    <td>{customer.email}</td>
                    <td>{customer.status}</td>
                    <td>
                      <button
                        className="btn-lock"
                        onClick={() => toggleStatus(index, customer.id)}
                      >
                        {customer.status === 'Hoạt Động' ? 'Khóa' : 'Mở'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default User;
