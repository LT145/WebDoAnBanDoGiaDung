import React from 'react';
import banner3 from './img/banner3.png';

const Banner3 = () => {
  return (
    <div className="max-w-[1150px] mx-auto mb-10 mt-3 px-4">
      <h3 className="text-xl sm:text-2xl font-semibold mb-3">
        Tuần lễ thương hiệu Samsung
      </h3>
      <img
        src={banner3}
        alt="Banner Samsung"
        className="w-full rounded-lg object-cover"
      />
    </div>
  );
};

export default Banner3;
