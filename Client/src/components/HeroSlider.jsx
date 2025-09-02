import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const sliderContent = [
    {
        image: 'https://i.ibb.co/sJW7YKcy/Generated-Image-August-28-2025-8-37-PM.jpg',
        title: 'Discover True Quality',
        subtitle: 'The Finest Selection of Handpicked Dry Fruits from Gilgit',
        cta: 'Shop Now'
    },
    {
        image: 'https://www.khandryfruit.com/cdn/shop/files/whisk-5c2a91b6bc-1-6870df7955b79.webp?v=1752227753&width=1600',
        title: 'Natural Goodness',
        subtitle: '100% Organic & Nutrient-Rich Dry Fruits',
        cta: 'Explore Products'
    },
    
];
const handleLink = () => {
    window.location.href = '/products';
}
const HeroSlider = () => {
  return (
    <div className="relative h-[60vh] md:h-[80vh]">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        // navigation prop yahan se hata diya gaya hai
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        effect="fade"
        className="h-full"
      >
        {sliderContent.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10"></div>
              <img src={slide.image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 z-20 flex flex-col justify-center items-start text-white p-6 md:p-12 lg:p-24">
                <h2 className="text-4xl md:text-6xl font-extrabold mb-4 max-w-2xl">{slide.title}</h2>
                <p className="text-lg md:text-xl mb-6 max-w-xl">{slide.subtitle}</p>
                <button onClick={handleLink} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
                  {slide.cta}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default HeroSlider;