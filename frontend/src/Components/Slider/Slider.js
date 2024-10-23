import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Slider.css';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const Slider = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]} // Register the modules
      spaceBetween={30}
      slidesPerView={1}
      autoplay={{ delay: 3000, disableOnInteraction: false }} // Autoplay settings
      pagination={{ clickable: true }}
      navigation
    >
      <SwiperSlide>
        <img src="https://via.placeholder.com/600x300?text=Slide+1" alt="Slide 1" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://via.placeholder.com/600x300?text=Slide+2" alt="Slide 2" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://via.placeholder.com/600x300?text=Slide+3" alt="Slide 3" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://via.placeholder.com/600x300?text=Slide+4" alt="Slide 4" />
      </SwiperSlide>
    </Swiper>
  );
};

export default Slider;
