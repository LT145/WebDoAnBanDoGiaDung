import React from 'react';
import './Banner.css';
import banner1 from './img/banner1.png';
import banner2 from './img/banner2.png';

const Banner2 = () => {
  return (
        <div id="banner2">
        <img className="img_banner2" src={banner1} alt="" />
        <img className="img_banner2" src={banner2} alt="" />
        </div>
  );
}

export default Banner2;
