import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FPW = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

        if (!email) {
      setError('Vui lòng nhập email.');
      return;
    }

    try {
            const response = await fetch(`http://localhost:5000/api/check-email?email=${email}`);
      const data = await response.json();

      if (data.exists) {
                navigate('/otp', { state: { email } });
      } else {
                setError('Không có tài khoản nào liên kết với email này.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div>
      <div id="title">
        <h3>Quên mật khẩu</h3>
        <p>Hãy nhập email của bạn vào bên dưới để bắt đầu quá trình khôi phục mật khẩu.</p>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form_group">
          <div className="box-input">
            <input
              type="email"
              placeholder="Nhập Email của bạn"
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              className="box-input__main"
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <button className="btn-form_submit" type="submit">Tiếp Tục</button>
      </form>
    </div>
  );
};

export default FPW;
