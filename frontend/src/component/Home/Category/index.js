import React from 'react';
import './Category.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Category = () => {
  return (
    <div id="table-container">
  <div className="row">
    <div className="cell">
      <img src={images.image1} alt="Máy giặt" />
      <span>Máy giặt</span>
    </div>
    <div className="cell">
      <img src={images.image2}  alt="Máy lọc nước" />
      <span>Máy lọc nước</span>
    </div>
    <div className="cell">
      <img src={images.image3}  alt="Tủ lạnh" />
      <span>Tủ lạnh</span>
    </div>
    <div className="cell">
      <img src={images.image4}  alt="Nồi cơm điện" />
      <span>Nồi cơm điện</span>
    </div>
    <div className="cell">
      <img src={images.image5}  alt="Máy lạnh" />
      <span>Máy lạnh</span>
    </div>
    <div className="cell">
      <img src={images.image6} alt="Bếp từ" />
      <span>Bếp từ</span>
    </div>
    <div className="cell">
      <img src={images.image7}  alt="Tủ đông" />
      <span>Tủ đông</span>
    </div>
    <div className="cell">
      <img src={images.image8}  alt="Máy lọc không khí" />
      <span>Máy lọc không khí</span>
    </div>
  </div>
  <div className="row">
    <div className="cell">
      <img src={images.image9}  alt="Máy nước nóng" />
      <span>Máy nước nóng</span>
    </div>
    <div className="cell">
      <img src={images.image10}  alt="Đồ gia dụng" />
      <span>Đồ gia dụng</span>
    </div>
    <div className="cell">
      <img src={images.image11}  alt="Tivi" />
      <span>Tivi</span>
    </div>
    <div className="cell">
      <img src={images.image12}  alt="Nồi chiên không dầu" />
      <span>Nồi chiên không dầu</span>
    </div>
    <div className="cell">
      <img src={images.image13}  alt="Máy sấy quần áo" />
      <span>Máy sấy quần áo</span>
    </div>
    <div className="cell">
      <img src={images.image14}  alt="Máy hút bụi" />
      <span>Máy hút bụi</span>
    </div>
    <div className="cell">
      <img src={images.image15}  alt="Loa" />
      <span>Loa</span>
    </div>
    <div className="cell">
      <i className="fa-solid fa-bars" style={{ fontSize: 30 }} />
      <span>Danh mục</span>
    </div>
  </div>
</div>
  );
}

export default Category;

const images = {
    image1: require('./img/maygiat.png'),
    image2: require('./img/maylocnuoc.png'),
    image3: require('./img/tulanh.png'),
    image4: require('./img/noicomdien.png'),
    image5: require('./img/maylanh.png'),
    image6: require('./img/beptu.png'),
    image7: require('./img/tudongmat.png'),
    image8: require('./img/maylockhongkhi.png'),
    image9: require('./img/maynuocnong.png'),
    image10: require('./img/dogiadung.png'),
    image11: require('./img/tivi.png'),
    image12: require('./img/noichienkhongdau.png'),
    image13: require('./img/maysayquanao.png'),
    image14: require('./img/mayhutbui.png'),
    image15: require('./img/loa.png'),

  };