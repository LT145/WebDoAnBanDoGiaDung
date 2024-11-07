import React, { useState } from 'react';
import './BoxInfo.css';
import imgts from './img/TSpanasonic.jpg'
const BoxInfo = () => {
  const [activeSections, setActiveSections] = useState({
    general: false,
    energy: false,
    technology: false,
    control: false,
    installation: false,
  });

  // Hàm xử lý toggle
  const toggleSection = (section) => {
    setActiveSections(prevState => ({
      ...prevState,
      [section]: !prevState[section], // Đảo ngược trạng thái hiện tại của mục
    }));
  };

  return (
    <div id="thongso">
      <div className="text">
        <h3>Thông số kỹ thuật</h3>
      </div>
      <img src={imgts} alt="" />
      
      {/* Tổng quan */}
      <div className="box-specifi">
        <a
          href="javascript:;"
          id="toggleButton"
          className={activeSections.general ? 'active' : ''}
          onClick={() => toggleSection('general')}
        >
          <h3>Tổng quan</h3>
          <i className="fa-solid fa-chevron-down" />
        </a>
        {/* Hiển thị nội dung nếu 'general' là section active */}
        <ul className={`text-specifi ${activeSections.general ? 'active' : ''}`}>
          <li><strong>Loại máy giặt:</strong> Cửa trên</li>
          <li><strong>Lồng giặt:</strong> Lồng đứng</li>
          <li><strong>Khối lượng giặt:</strong> 8.5 Kg</li>
          <li><strong>Số người sử dụng:</strong> Từ 3 - 5 người</li>
          <li><strong>Kiểu động cơ:</strong> Truyền động gián tiếp (dây Curoa)</li>
          <li><strong>Tốc độ quay vắt tối đa:</strong> 700 vòng/phút</li>
          <li><strong>Chất liệu lồng giặt:</strong> Thép không gỉ</li>
          <li><strong>Chất liệu vỏ máy:</strong> Kim loại sơn tĩnh điện</li>
          <li><strong>Chất liệu nắp máy:</strong> Kính chịu lực</li>
          <li><strong>Sản xuất tại:</strong> Việt Nam</li>
          <li><strong>Năm ra mắt:</strong> 2021</li>
          <li><strong>Thời gian bảo hành động cơ:</strong> 2 năm</li>
        </ul>
      </div>

      {/* Mức tiêu thụ điện năng */}
      <div className="box-specifi">
        <a
          href="javascript:;"
          id="toggleButton"
          className={activeSections.energy ? 'active' : ''}
          onClick={() => toggleSection('energy')}
        >
          <h3>Mức tiêu thụ điện năng</h3>
          <i className="fa-solid fa-chevron-down" />
        </a>
        <ul className={`text-specifi ${activeSections.energy ? 'active' : ''}`}>
          <li><strong>Hiệu suất điện:</strong> 6.45 Wh/kg</li>
        </ul>
      </div>

      {/* Công Nghệ Giặt */}
      <div className="box-specifi">
        <a
          href="javascript:;"
          id="toggleButton"
          className={activeSections.technology ? 'active' : ''}
          onClick={() => toggleSection('technology')}
        >
          <h3>Công Nghệ Giặt</h3>
          <i className="fa-solid fa-chevron-down" />
        </a>
        <ul className={`text-specifi ${activeSections.technology ? 'active' : ''}`}>
        <li>
                        <aside>
                            <strong>Chương trình:</strong>
                        </aside>
                        <aside>
                            <span class="circle1">Vệ sinh lồng giặt</span>
                            <span class="circle1">Tiết kiệm nước</span>
                            <span class="circle1">Sấy gió</span>
                            <span class="circle1">Giặt tăng cường</span>
                            <span class="circle1">Giặt thường</span>
                            <span class="circle1">Giặt nhẹ</span>
                            <span class="circle1">Giặt nhanh</span>
                            <span class="circle1">Chăn mền</span>
                        </aside>
                    </li>
                    <li>
                        <aside>
                            <strong>Công nghệ giặt:</strong>
                        </aside>
                        <aside>
                            <span class="circle2">Mâm giặt kháng khuẩn Ag Pulsator</span>
                            <span class="circle2">Lồng giặt Sazanami</span>
                            <span class="circle2">Luồng nước Dancing Water Flow</span>
                            <span class="circle2">Hệ thống ActiveFoam</span>
                            <span class="circle2">Công nghệ xả nước Aqua Spin Rinse</span>
                            <span class="circle2">Công nghệ giặt chuyên biệt StainMaster</span>
                        </aside>
                    </li>
        </ul>
      </div>

      {/* Bảng điều khiển và tiện ích */}
      <div className="box-specifi">
        <a
          href="javascript:;"
          id="toggleButton"
          className={activeSections.control ? 'active' : ''}
          onClick={() => toggleSection('control')}
        >
          <h3>Bảng điều khiển và tiện ích</h3>
          <i className="fa-solid fa-chevron-down" />
        </a>
        <ul className={`text-specifi ${activeSections.control ? 'active' : ''}`}>
        <li>
                        <aside>
                            <strong>Bảng điều khiển:</strong>
                        </aside>
                        <aside>
                            <span >Song ngữ Anh - Việt có nút nhấn</span>
                        </aside>
                    </li>
                    <li>
                        <aside>
                            <strong>Tiện ích:</strong>
                        </aside>
                        <aside>
                            <span class="circle2">Tự động gỡ rối Tangle Care</span>
                            <span class="circle2">Tự khởi động lại khi có điện</span>
                            <span class="circle2">Sấy gió</span>
                            <span class="circle2">Nắp máy trợ lực chống kẹt tay</span>
                            <span class="circle2">Khóa trẻ em</span>
                            <span class="circle2">Hẹn giờ giặt</span>
                            <span class="circle2">Bộ lọc xơ vải Ag</span>
                            <span class="circle2">Khử mùi kháng khuẩn</span>
                        </aside>
                    </li>
        </ul>
      </div>

      {/* Thông tin lắp đặt */}
      <div className="box-specifi">
        <a
          href="javascript:;"
          id="toggleButton"
          className={activeSections.installation ? 'active' : ''}
          onClick={() => toggleSection('installation')}
        >
          <h3>Thông tin lắp đặt</h3>
          <i className="fa-solid fa-chevron-down" />
        </a>
        <ul className={`text-specifi ${activeSections.installation ? 'active' : ''}`}>
          <li><strong>Kích thước - Khối lượng:</strong> Cao 104.3 cm - Ngang 54.6 cm - Sâu 61 cm - Nặng 36 kg</li>
          <li><strong>Chiều dài ống cấp nước:</strong> 110 cm</li>
          <li><strong>Chiều dài ống thoát nước:</strong> 82 cm</li>
        </ul>
      </div>
    </div>
  );
};

export default BoxInfo;
