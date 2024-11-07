import React from 'react';
import './BoxRight.css';
const BoxRight = () => {
    return (
  <div id="box-right">
    <img src="./IMG/11-11.jpg" alt="" />
    <div className="box03">
      <a href="" data-index={0} className="box03_item act">
        8.5 KG
      </a>
      <a href="" data-index={1} className="box03_item">
        9 KG
      </a>
      <a href="" data-index={2} className="box03_item">
        10 KG
      </a>
      <a href="" data-index={3} className="box03_item">
        11 KG
      </a>
    </div>
    <div className="loca">
      <p>
        Giá tại<a href="">Hồ Chí Minh</a>
      </p>
      <i className="fa-solid fa-angle-down" />
    </div>
    <div className="buy">
      <h3>5.990.000đ</h3>
      <span className="label">Trả góp 0%</span>
    </div>
    <div className="block__promo">
      <div className="pr-top">
        <p className="pr-txtb">Khuyến mãi </p>
        <i className="pr-txt">
          Giá và khuyến mãi dự kiến áp dụng đến 23:59 | 30/11
        </i>
      </div>
      <div className="pr-content">
        <div className="pr-item">
          <div
            className="divb t1"
            data-promotion={2384287}
            data-group="tặng"
            data-discount={0}
            data-productcode={7042011000224}
            data-tovalue={0}
          >
            <span className="nb">1</span>
            <div className="divb-right">
              <p>Miễn phí công lắp đặt</p>
            </div>
          </div>
          <div className="divb t2">
            <span className="nb">2</span>
            <div className="divb-right">
              <p>
                Giảm thêm 3% khi mua cùng sản phẩm có giá cao hơn (trừ Xe đạp,
                sản phẩm Apple, sản phẩm giá sốc)
              </p>
            </div>
          </div>
          <div className="divb t3">
            <span className="nb">3</span>
            <div className="divb-right">
              <p>
                Nhập mã VNPAYTGDD5 giảm từ 50,000đ đến 200,000đ (áp dụng tùy giá
                trị đơn hàng) khi thanh toán qua VNPAY-QR.{" "}
                <a href="" target="_blank">
                  (Xem chi tiết tại đây)
                </a>
              </p>
            </div>
          </div>
          <div className="divb t4">
            <span className="nb">4</span>
            <div className="divb-right">
              <p>
                Cơ hội nhận ngay Phiếu mua hàng trị giá 1,000,000đ khi tham gia
                Trả góp Duyệt qua điện thoại, giao hàng tận nhà.{" "}
                <a href="">(Xem chi tiết tại đây)</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="giaohang">
      <i className="fa-solid fa-location-dot" />
      <a href="">Chọn địa điểm giao hàng.</a>
    </div>
    <div className="block-button buy">
      <div className="button-row">
        <a href="#" className="btn-buynow1">
          <i className="fa-solid fa-cart-shopping" />
          Thêm vào giỏ hàng
        </a>
        <a href="#" className="btn-buynow">
          Mua ngay
        </a>
      </div>
      <div className="button-row">
        <a href="#" className="btn-ins pay-taichinh">
          Mua trả góp 0%
          <span>Duyệt hồ sơ trong 5 phút</span>
        </a>
        <a href="#" className="btn-ins pay-nganluong">
          Trả góp 0% qua thẻ
          <span>Visa, Mastercard, JCB</span>
        </a>
      </div>
    </div>
    <div className="phone">
      <i className="fa-solid fa-phone" />
      <p>Gọi điện đặt hàng</p>
      <a href="#">18008386</a>
    </div>
    <div className="shop">
      <i className="fa-solid fa-shop" />
      <a href="./index.html">Xem các mặt hàng khác.</a>
    </div>
  </div>

    );
  }
  
  export default BoxRight;
  