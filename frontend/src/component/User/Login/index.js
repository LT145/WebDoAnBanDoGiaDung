import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

      // Lưu token, username và role vào localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('iduser', data.id);
      localStorage.setItem('username', data.username);  // Lưu username
      localStorage.setItem('name', data.name);
      localStorage.setItem('role', data.role);  // Lưu role
      localStorage.setItem('email', data.email);
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
    <div className="max-w-[600px] mx-auto p-4">
      <div id="title" className="text-center mb-6">
        <h3 className="text-2xl font-semibold">Đăng Nhập Tài Khoản</h3>
      </div>
      <form className="login-form space-y-4" onSubmit={handleSubmit}>
        <div className="form_group space-y-4">
          <div className="box-input relative">
            <input
              type="text"
              placeholder="Nhập tên tài khoản"
              maxLength={255}
              required
              autoComplete="off"
              className="box-input__main w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="box-input_label absolute top-0 left-0 px-4 py-2 text-gray-600">TÊN TÀI KHOẢN</label>
          </div>
          <div className="box-input relative">
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              maxLength={255}
              required
              autoComplete="off"
              className="box-input__main w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="box-input_label absolute top-0 left-0 px-4 py-2 text-gray-600">MẬT KHẨU</label>
          </div>
          <div className="group_option flex items-center justify-center relative">
            <div className="flex-grow border-t border-gray-300"></div>
            <p className="mx-4 text-orange-500 cursor-pointer" onClick={() => navigate('/fpw')}>
              Quên Mật Khẩu
            </p>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

        </div>
        <button type="submit" className="btn-form_submit w-full py-2 mt-4 bg-orange-400 text-white font-semibold rounded-lg shadow-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300">
          Đăng nhập
        </button>

        {errorMessage && <p className="error-message text-red-500 text-center mt-2">{errorMessage}</p>}

        <div className="singup text-center mt-4">
          <p className="text-x ml-10">Bạn chưa có tài khoản?</p>
          <p className="btn-dangky text-orange-500 ml-10" onClick={() => navigate('/register')}>Đăng ký ngay</p>
        </div>
      </form>
    </div>
  );
}
