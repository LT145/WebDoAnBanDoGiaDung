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
  
  const otpSent = useRef(false);  
  useEffect(() => {
    if (email && !otpSent.current && !generatedOtp) {        sendOtp();
      otpSent.current = true;      }
  }, [email, generatedOtp]);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtp = async () => {
    try {
      const otp = generateOTP();
      setGeneratedOtp(otp); 
            await emailjs.send(
        'service_ilyoatp',         'template_rsp9r4j',         {
          otp: otp,
          email: email,
        },
        'R7jXW_YZ9f8xHg7YO'       );

      setMessage(`OTP đã được gửi tới email của bạn: ${email}`);
    } catch (err) {
      setError('Không thể gửi OTP. Vui lòng thử lại.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

        if (otp === generatedOtp) {
      setMessage('OTP hợp lệ! Bạn có thể thay đổi mật khẩu.');
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
