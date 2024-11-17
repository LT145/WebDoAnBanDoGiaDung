import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '', // Thêm trường username
    phone: '',
    email: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    name: '',
    username: '', // Thêm lỗi cho username
    phone: '',
    email: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let formErrors = {};
    let isValid = true;

    // Kiểm tra họ tên
    if (!formData.name) {
      formErrors.name = 'Vui lòng nhập họ và tên';
      isValid = false;
    }

    // Kiểm tra username
    if (!formData.username) {
      formErrors.username = 'Vui lòng nhập tên tài khoản';
      isValid = false;
    }

    // Kiểm tra số điện thoại
    if (!formData.phone) {
      formErrors.phone = 'Vui lòng nhập số điện thoại';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      formErrors.phone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }

    // Kiểm tra mật khẩu
    if (!formData.password) {
      formErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    }

    // Kiểm tra xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      console.log('Dữ liệu gửi lên backend:', formData);
      try {
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Đăng ký thành công:', data);
          alert('Đăng ký thành công');
          navigate('/login');
        } else {
          console.log('Lỗi:', data);
          alert(`Lỗi: ${data.message}`);
        }
      } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        alert('Đã xảy ra lỗi khi đăng ký.');
      }
    }
  };

  return (
    <div>
      <div id="title">
        <h3>Đăng Ký Tài Khoản</h3>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form_group">
          <div className="box-input">
            <input
              type="text"
              placeholder="Nhập tên tài khoản"
              maxLength={50}
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="box-input__main"
            />
            <label className="box-input_label">Tên Tài Khoản*</label>
            {errors.username && <div className="box-input_err-validate">{errors.username}</div>}
          </div>
          <div className="box-input">
            <input
              type="text"
              placeholder="Nhập họ tên"
              maxLength={50}
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="box-input__main"
            />
            <label className="box-input_label">Họ Và Tên*</label>
            {errors.name && <div className="box-input_err-validate">{errors.name}</div>}
          </div>
          <div className="box-input">
            <input
              type="tel"
              placeholder="Nhập số điện thoại"
              maxLength={10}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="box-input__main"
            />
            <label className="box-input_label">Số Điện Thoại*</label>
            {errors.phone && <div className="box-input_err-validate">{errors.phone}</div>}
          </div>
          <div className="box-input">
            <input
              type="email"
              placeholder="Nhập email(không bắt buộc)"
              maxLength={50}
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="box-input__main"
            />
            <label className="box-input_label">Email</label>
            {errors.email && <div className="box-input_err-validate">{errors.email}</div>}
          </div>
          <div className="box-input">
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="box-input__main"
            />
            <label className="box-input_label">Ngày Sinh</label>
            {errors.birthDate && <div className="box-input_err-validate">{errors.birthDate}</div>}
          </div>
          <div className="box-input">
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              maxLength={100}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="box-input__main"
            />
            <label className="box-input_label">Mật Khẩu*</label>
            {errors.password && <div className="box-input_err-validate">{errors.password}</div>}
          </div>
          <div className="box-input">
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              maxLength={100}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="box-input__main"
            />
            <label className="box-input_label">Xác Nhận Mật Khẩu*</label>
            {errors.confirmPassword && <div className="box-input_err-validate">{errors.confirmPassword}</div>}
          </div>
        </div>
        <button type="submit" className="btn-form_submit">Đăng Ký</button>
        <div className="singup">
          <p>Bạn đã có tài khoản?</p>
          <a href="./log.html">Đăng nhập ngay</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
