import React, { useState, useEffect } from 'react';

const User = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu giá trị tìm kiếm

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

  // Lọc khách hàng theo từ khóa tìm kiếm
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
    <section className="flex-1 bg-white min-h-screen p-2.5 transition-all duration-500 ease-in-out">
      <div className="top flex items-center justify-between p-4 mb-10 bg-white z-10">
        <div className="search-box relative p-6 max-w-xl w-full">
          <i className="fa-solid fa-magnifying-glass absolute mt-6 ml-5 top-1/2 transform -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            placeholder="Search...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị tìm kiếm
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>
      </div>
      <div className="dash-content">
        <div className="overview">
          <div className="title flex items-center gap-4 mb-4">
            <i className="fa-solid fa-users bg-blue-600 ml-10 text-white p-3 rounded-full text-xl" />
            <span className="text-xl font-semibold text-black">Quản Lý Đăng Nhập Khách Hàng</span>
          </div>
          {/* Bảng thông tin khách hàng */}
          <div className="customer-table bg-gray-100 p-4 rounded-lg shadow-md">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left bg-blue-600 text-white">Họ Tên</th>
                  <th className="px-4 py-2 text-left bg-blue-600 text-white">Số Điện Thoại</th>
                  <th className="px-4 py-2 text-left bg-blue-600 text-white">Tên Tài Khoản</th>
                  <th className="px-4 py-2 text-left bg-blue-600 text-white">Mật Khẩu</th>
                  <th className="px-4 py-2 text-left bg-blue-600 text-white">Email</th>
                  <th className="px-4 py-2 text-left bg-blue-600 text-white">Trạng Thái</th>
                  <th className="px-4 py-2 text-left bg-blue-600 text-white">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="px-4 py-2">{customer.name}</td>
                    <td className="px-4 py-2">{customer.phone}</td>
                    <td className="px-4 py-2">{customer.username}</td>
                    <td className="px-4 py-2">{customer.password}</td>
                    <td className="px-4 py-2">{customer.email}</td>
                    <td className="px-4 py-2">{customer.status}</td>
                    <td className="px-4 py-2">
                      <button
                        className="btn-lock bg-orange-400 text-white px-4 py-2 rounded-md"
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
