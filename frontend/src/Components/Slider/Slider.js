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
        <img src="https://i.ibb.co/5sFdLzm/Image1.jpg" alt="Slide 1" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://i.ibb.co/JQLytc6/Image3.jpg" alt="Slide 2" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://i.ibb.co/HFvm0rL/Image2.jpg" alt="Slide 3" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://i.ibb.co/c2vfpTM/Image4.jpg" alt="Slide 4" />
      </SwiperSlide>
    </Swiper>
  );
};

export default Slider;
