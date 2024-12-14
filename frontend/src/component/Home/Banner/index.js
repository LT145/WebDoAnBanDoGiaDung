import React from 'react';
import banner from './img/banner.png';

const Banner = () => {
  return (
    <div className="w-full flex justify-center mt-3 px-4">
      <img
        className="w-full max-w-[1150px] rounded-2xl object-cover"
        src={banner}
        alt="banner"
      />
    </div>
  );
};

export default Banner;
