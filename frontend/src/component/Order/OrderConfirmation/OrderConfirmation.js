import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderConfirmation.css'
const OrderConfirmation = () => {
  const [countdown, setCountdown] = useState(5);   const navigate = useNavigate();

    useEffect(() => {
    if (countdown === 0) {
      navigate('/profile');     }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

        return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="order-confirmation">
      <h2>Đơn hàng của bạn đã được gửi cho bộ phận xử lý...</h2>
      <p>Xin cảm ơn bạn đã mua hàng!</p>
      <p>Bạn sẽ được chuyển hướng đến trang chi tiết đơn hàng trong {countdown} giây...</p>
    </div>
  );
};

export default OrderConfirmation;
