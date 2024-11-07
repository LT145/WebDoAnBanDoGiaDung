import React from 'react';
import './CamKet.css';
const CamKet = () => {
    return (
        <div id="camket">
  <p>Loc And Nhut cam kết</p>
  <div className="camket-container">
    <div className="box">
      <i className="fa-solid fa-check-circle" />
      <p>Chất lượng đảm bảo</p>
    </div>
    <div className="box">
      <i className="fa-solid fa-shield-alt" />
      <p>An toàn tuyệt đối</p>
    </div>
    <div className="box">
      <i className="fa-solid fa-truck" />
      <p>Giao hàng nhanh</p>
    </div>
    <div className="box">
      <i className="fa-solid fa-hand-holding-usd" />
      <p>Giá cả hợp lý</p>
    </div>
    <div className="box">
      <i className="fa-solid fa-thumbs-up" />
      <p>Đảm bảo hài lòng</p>
    </div>
  </div>
</div>

    );
  }
  
  export default CamKet;
  