import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Adminad = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Thêm state cho giá trị tìm kiếm
  const navigate = useNavigate();

  // Gọi API để lấy danh sách người dùng từ backend
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        // Lọc ra những người có role là "admin"
        const adminRoleData = data.filter(user => user.role === 'admin');
        // Chuyển đổi trạng thái từ 0,1 thành "Hoạt Động" hoặc "Khóa"
        const updatedData = adminRoleData.map(user => ({
          ...user,
          status: user.status === 1 ? 'Hoạt Động' : 'Khóa', // Convert 1 to "Hoạt Động" and 0 to "Khóa"
        }));
        setAdmins(updatedData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
      }
    };

    fetchAdmins();
  }, []);

  // Hàm cập nhật trạng thái của admin
  const toggleStatus = async (index, userId) => {
    const currentStatus = admins[index].status;
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
        const updatedAdmins = [...admins];
        updatedAdmins[index].status = newStatus === 1 ? 'Hoạt Động' : 'Khóa'; // Convert 1 và 0 về trạng thái hiển thị
        setAdmins(updatedAdmins);
      } else {
        console.error('Lỗi khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  // Hàm tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Cập nhật giá trị tìm kiếm khi người dùng nhập
  };

  // Lọc danh sách admin theo giá trị tìm kiếm
  const filteredAdmins = admins.filter(admin => {
    const searchValue = searchTerm.toLowerCase();
    return (
      (admin.name && admin.name.toLowerCase().includes(searchValue)) ||
      (admin.phone && admin.phone.toLowerCase().includes(searchValue)) ||
      (admin.username && admin.username.toLowerCase().includes(searchValue)) ||
      (admin.email && admin.email.toLowerCase().includes(searchValue))
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
            value={searchTerm} // Liên kết với giá trị của state tìm kiếm
            onChange={handleSearchChange} // Gọi hàm khi người dùng nhập
          />
        </div>
      </div>
      <div className="dash-content">
        <div className="overview">
          <div className="title">
            <i className="fa-solid fa-users" />
            <span className="text">Quản Lý Đăng Nhập Admin</span>
            <button className="btn-register-admin" onClick={() => navigate('registerAdmin')}>Đăng ký Admin</button>
          </div>
          {/* Bảng thông tin admin */}
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
                {filteredAdmins.map((admin, index) => (
                  <tr key={index}>
                    <td>{admin.name}</td>
                    <td>{admin.phone}</td>
                    <td>{admin.username}</td>
                    <td>{admin.password}</td>
                    <td>{admin.email}</td>
                    <td>{admin.status}</td>
                    <td>
                      <button
                        className="btn-lock"
                        onClick={() => toggleStatus(index, admin.id)}
                      >
                        {admin.status === 'Hoạt Động' ? 'Khóa' : 'Mở'}
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

export default Adminad;
