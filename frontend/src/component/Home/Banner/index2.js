import React from 'react';
import banner1 from './img/banner1.png';
import banner2 from './img/banner2.png';

const Banner2 = () => {
  return (
    <div className="max-w-[1160px] mx-auto mt-3 flex justify-center items-center gap-2.5 px-2">
      <img
        className="w-[calc(50%-10px)] rounded-xl object-cover"
        src={banner1}
        alt="Banner 1"
      />
      <img
        className="w-[calc(50%-10px)] rounded-xl object-cover"
        src={banner2}
        alt="Banner 2"
      />
    </div>
  );
};

export default Banner2;
