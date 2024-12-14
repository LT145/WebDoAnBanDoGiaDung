import React from 'react';
import './BoxFB.css';
const BoxFB = () => {
    return (
      <div id="feedback">
      <h3>Đánh giá Máy giặt Panasonic 8.5 Kg NA-F85A9BRV</h3>
      <div className="star">
        <strong>0</strong>
        <i className="fa-solid fa-star" />
        <i className="fa-solid fa-star" />
        <i className="fa-solid fa-star" />
        <i className="fa-solid fa-star" />
        <i className="fa-regular fa-star-half-stroke" />
        <a href="">0 đánh giá</a>
      </div>
      <ul className="rate-list">
        <li>
          <div className="number-star">
            5<i className="fa-solid fa-star" />
          </div>
          <div className="timeline-star">
            <p className="timing" style={{ width: "0%" }} />
          </div>
          <span className="number-percent">0%</span>
        </li>
        <li>
          <div className="number-star">
            4<i className="fa-solid fa-star" />
          </div>
          <div className="timeline-star">
            <p className="timing" style={{ width: "0%" }} />
          </div>
          <span className="number-percent">0%</span>
        </li>
        <li>
          <div className="number-star">
            3<i className="fa-solid fa-star" />
          </div>
          <div className="timeline-star">
            <p className="timing" style={{ width: "0%" }} />
          </div>
          <span className="number-percent">0%</span>
        </li>
        <li>
          <div className="number-star">
            2<i className="fa-solid fa-star" />
          </div>
          <div className="timeline-star">
            <p className="timing" style={{ width: "0%" }} />
          </div>
          <span className="number-percent">0%</span>
        </li>
        <li>
          <div className="number-star">
            1<i className="fa-solid fa-star" />
          </div>
          <div className="timeline-star">
            <p className="timing" style={{ width: "0%" }} />
          </div>
          <span className="number-percent">0%</span>
        </li>
      </ul>
      <div className="img_feedback">
        <img src="./IMG/fb1.jpg" alt="" />
        <img src="./IMG/fb2.jpg" alt="" />
        <img src="./IMG/fb2.jpg" alt="" />
        <img src="./IMG/fb2.jpg" alt="" />
      </div>
      <ul className="review-list">
        <li id="review" className="review-item">
          <div className="review-header">
            <p className="reviewer-name">Tên Người FeedBack</p>
          </div>
          <div className="review-intro">
            <div className="review-stars">
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star" />
            </div>
            
          </div>
          <div className="review-content">
            <p className="review-comment">
              Nội Dung FeedBack
            </p>
          </div>
        </li>
      </ul>
      <div className="box-flex">
        <a href="" className="c-btn-rate">
          Xem đánh giá
        </a>
        <div className="c-btn-rate btn-write">Viết đánh giá</div>
      </div>
    </div>
    
    );
  }
  
  export default BoxFB;
  