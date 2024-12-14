import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const images = {
  imagefb: require('./img/facebook.png'),
  imageyb: require('./img/youtube.png'),
  imagezl: require('./img/zalo.png'),
};

const Footer = () => {
  return (
    <div className="bg-orange-400 text-white py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Phần thông tin công ty */}
          <div className="footer-info">
            <h3 className="text-xl font-semibold mb-4">Công ty</h3>
            <p className="text-sm mb-4 opacity-80">
              Thương hiệu uy tín số 1 Việt Nam, chuyên cung cấp các sản phẩm chất lượng cao, bảo hành lên tới 18 tháng.
            </p>
            <ul className="space-y-2 text-sm opacity-90">
              <li>Công ty Cổ Phần Sube Việt Nam</li>
              <li>Điện thoại: 033.220.3638</li>
              <li>Email: nhutandloc@gmail.com</li>
            </ul>
          </div>
          
          {/* Phần liên kết thông tin */}
          <div className="footer-links">
            <h3 className="text-xl font-semibold mb-4">Thông tin</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="/about" className="hover:text-gray-300">Giới thiệu</a></li>
              <li><a href="/contact" className="hover:text-gray-300">Liên hệ</a></li>
              <li><a href="/privacy" className="hover:text-gray-300">Chính sách bảo mật</a></li>
              <li><a href="/terms" className="hover:text-gray-300">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          {/* Phần dịch vụ */}
          <div className="footer-services">
            <h3 className="text-xl font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="/shipping" className="hover:text-gray-300">Chính sách giao hàng</a></li>
              <li><a href="/returns" className="hover:text-gray-300">Chính sách đổi trả</a></li>
              <li><a href="/warranty" className="hover:text-gray-300">Chính sách bảo hành</a></li>
            </ul>
          </div>

          {/* Phần kết nối với mạng xã hội */}
          <div className="footer-social">
            <h3 className="text-xl font-semibold mb-4">Kết nối với chúng tôi</h3>
            <div className="flex space-x-6 justify-center sm:justify-start">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={images.imagefb} alt="Facebook" className="w-8 h-8 hover:opacity-80" />
              </a>
              <a href="https://zalo.me" target="_blank" rel="noopener noreferrer">
                <img src={images.imagezl} alt="Zalo" className="w-8 h-8 hover:opacity-80" />
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                <img src={images.imageyb} alt="YouTube" className="w-8 h-8 hover:opacity-80" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
