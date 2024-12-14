import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useLocation, useNavigate } from 'react-router-dom';

const OTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  
  const otpSent = useRef(false);  // Dùng useRef để giữ giá trị giữa các lần render

  useEffect(() => {
    if (email && !otpSent.current && !generatedOtp) {  // Kiểm tra nếu OTP chưa được gửi và OTP chưa được tạo
      sendOtp();
      otpSent.current = true;  // Đánh dấu rằng OTP đã được gửi
    }
  }, [email, generatedOtp]);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtp = async () => {
    try {
      const otp = generateOTP();
      setGeneratedOtp(otp); // Lưu OTP được tạo ra để xác minh sau

      // Gửi OTP qua email
      await emailjs.send(
        'service_ilyoatp', // Thay YOUR_SERVICE_ID bằng ID dịch vụ của bạn
        'template_rsp9r4j', // Thay YOUR_TEMPLATE_ID bằng ID mẫu của bạn
        {
          otp: otp,
          email: email,
        },
        'R7jXW_YZ9f8xHg7YO' // Thay YOUR_PUBLIC_KEY bằng khóa công khai của bạn từ EmailJS
      );

      setMessage(`OTP đã được gửi tới email của bạn: ${email}`);
    } catch (err) {
      setError('Không thể gửi OTP. Vui lòng thử lại.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Kiểm tra OTP người dùng nhập với OTP đã được gửi
    if (otp === generatedOtp) {
      setMessage('OTP hợp lệ! Bạn có thể thay đổi mật khẩu.');
      // Điều hướng đến trang đặt lại mật khẩu hoặc tiếp tục xử lý đặt lại mật khẩu
      navigate('/reset-password', { state: { email } });
    } else {
      setError('OTP không chính xác. Vui lòng thử lại.');
    }
  };

  return (
    <div>
      <div id="title">
      <h3>Nhập mã OTP</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form_group">
        <div className="box-input">
          <input
            type="text"
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="box-input__main"
          />
        </div>
        </div>
        <button className="btn-form_submit" type="submit">Xác nhận OTP</button>
      </form>
    </div>
  );
};

export default OTP;
