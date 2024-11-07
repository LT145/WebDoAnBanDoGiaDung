import React from 'react';
import './Banner.css';
import banner from './img/banner.png';

const Banner = () => {
  return (
    <div id="baner">
    <img className="img_baner" src={banner} alt="banner" />
  </div>
  );
}

export default Banner;
