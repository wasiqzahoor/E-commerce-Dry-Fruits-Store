// Enhanced TextMarquee.js
import React from 'react';
import Marquee from "react-fast-marquee";

const TextMarquee = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-4 overflow-hidden shadow-md">
      <Marquee speed={60} gradient={false} pauseOnHover>
        <div className="flex items-center">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center mx-6 md:mx-10">
              <span className="text-lg font-bold uppercase tracking-wide">Gilgit Dry Fruits</span>
              <span className="mx-3 md:mx-5 text-xl font-thin">•</span>
              <span className="text-amber-300">Premium Quality</span>
              <span className="mx-3 md:mx-5 text-xl font-thin">•</span>
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
};
export default TextMarquee;