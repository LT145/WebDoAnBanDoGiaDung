import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Đăng nhập thất bại');
        return;
      }

            localStorage.setItem('token', data.token);
      localStorage.setItem('iduser', data.id);
      localStorage.setItem('username', data.username);        localStorage.setItem('name', data.name); 
      localStorage.setItem('role', data.role);        localStorage.setItem('email', data.email);
      localStorage.setItem('phone', data.phone);
      localStorage.setItem('dob', data.dob);

      if (data.role === 'admin') {
        navigate('/admin');
        window.location.reload();
      } else {
        navigate('/home');
        window.location.reload();
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại!');
    }
  };

  return (
    <div>
      <div id="title">
        <h3>Đăng Nhập Tài Khoản</h3>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form_group">
          <div className="box-input">
            <input
              type="text"
              placeholder="Nhập tên tài khoản"
              maxLength={255}
              required=""
              autoComplete="off"
              className="box-input__main"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="box-input_label">TÊN TÀI KHOẢN</label>
          </div>
          <div className="box-input">
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              maxLength={255}
              required=""
              autoComplete="off"
              className="box-input__main"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="box-input_label">MẬT KHẨU</label>
          </div>
          <div className="group_option">
          <p className="btn-dangky" onClick={() => navigate('/fpw')}>Quên Mật Khẩu</p>
          </div>
        </div>
        <button className="btn-form_submit">Đăng nhập</button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="singup">
          <p>Bạn chưa có tài khoản?</p>
          <br />
          <p className="btn-dangky" onClick={() => navigate('/register')}>Đăng ký ngay</p>
        </div>
      </form>
    </div>
  );
}
