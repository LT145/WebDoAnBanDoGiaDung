import React, { useState, useEffect } from 'react';

const User = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
    useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
                const userRoleData = data.filter(user => user.role === 'user');
                const updatedData = userRoleData.map(user => ({
          ...user,
          status: user.status === 1 ? 'Hoạt Động' : 'Khóa',         }));
        setCustomers(updatedData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
      }
    };

    fetchUsers();
  }, []);

    const toggleStatus = async (index, userId) => {
    const currentStatus = customers[index].status;
    const newStatus = currentStatus === 'Hoạt Động' ? 0 : 1; 
    try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
                const updatedCustomers = [...customers];
        updatedCustomers[index].status = newStatus === 1 ? 'Hoạt Động' : 'Khóa';         setCustomers(updatedCustomers);
      } else {
        console.error('Lỗi khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

    const filteredCustomers = customers.filter(customer => {
    const searchValue = searchTerm.toLowerCase();
    return (
      (customer.name && customer.name.toLowerCase().includes(searchValue)) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchValue)) ||
      (customer.username && customer.username.toLowerCase().includes(searchValue)) ||
      (customer.email && customer.email.toLowerCase().includes(searchValue))
    );
  });

  return (
    <section className="dashboard">
      <div className="top">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}           />
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
                {filteredCustomers.map((customer, index) => (
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
