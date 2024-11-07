import React from 'react';
import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const images = {
    imagefb: require('./img/facebook.png'),
    imageyb: require('./img/youtube.png'),
    imagezl: require('./img/zalo.png'),
  };
const Footer = () => {
  return (
    <div id="footer">
  <div className="footer-section">
  {/* Phần bên trái */}
  <div className="footer-section_left">
    <p>
      Thương hiệu uy tín số 1 Việt Nam các sản phẩm <br />
      bán tại shop được bảo hành lên tới 18 tháng <br />
      và 1 đổi 1 khi phát hiện lỗi sản phẩm.
    </p>
    <ul>
      <li>Công ty Cổ Phần Sube Việt Nam</li>
      <li>Điện thoại: 033.220.3638</li>
      <li>Email: nhutandloc@gmail.com</li>
      <li>Trung tâm vận hành: TP HỒ CHÍ MINH</li>
      <li>MST: 0108085048 – Ngày cấp: 06/12/2024</li>
      <li>Nơi cấp: sở Kế hoạch và đầu tư TP. HỒ CHÍ MINH</li>
    </ul>
  </div>
  {/* Phần giữa */}
  <div className="footer-section_center">
    <h3>Thông tin</h3>
    <ul>
      <li>Giới thiệu</li>
      <li>Liên hệ</li>
      <li>Chính sách</li>
      <li>Chính sách bảo mật</li>
      <li>Chính sách bảo hành</li>
      <li>Chính sách giao hàng</li>
    </ul>
  </div>
  {/* Phần bên phải */}
  <div className="footer-section_right">
  <h3>Kết nối với chúng tôi</h3>
  <ul className="social-icons">
    <li>
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
        <img src={images.imagefb} alt="Facebook" /> Facebook
      </a>
    </li>
    <li>
      <a href="https://zalo.me" target="_blank" rel="noopener noreferrer">
        <img src={images.imagezl} alt="Zalo" /> Zalo
      </a>
    </li>
    <li>
      <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
        <img src={images.imageyb} alt="YouTube" /> YouTube
      </a>
    </li>
  </ul>
</div>
</div>


</div>

  );
}

export default Footer;
