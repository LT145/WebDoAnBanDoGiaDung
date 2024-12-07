import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;    
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(3); // Biến đếm ngược

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      // Gọi API để đặt lại mật khẩu, truyền `email` và `newPassword`
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),  // Gửi email và mật khẩu mới
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Mật khẩu đã được thay đổi thành công!');
        // Bắt đầu đếm ngược khi đổi mật khẩu thành công
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);

        // Sau 3 giây, điều hướng về trang đăng nhập
        setTimeout(() => {
          clearInterval(countdownInterval);  // Dừng đếm ngược
          navigate('/login');  // Điều hướng về trang đăng nhập
        }, 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div>
      <div id="title">
        <h3>Đặt lại mật khẩu</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && (
          <div>
            <p style={{ color: 'green' }}>{message}</p>
            <p>Chuyển về trang đăng nhập sau {countdown} giây...</p> {/* Thông báo đếm ngược */}
          </div>
        )}
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form_group">
          <div className="box-input">
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="box-input__main"
            />
          </div>
        </div>
        <div className="form_group">
          <div className="box-input">
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="box-input__main"
            />
          </div>
        </div>
        <button className="btn-form_submit" type="submit">
          Đặt lại mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
