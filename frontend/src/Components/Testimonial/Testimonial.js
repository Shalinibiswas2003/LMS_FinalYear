import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Testimonial.css'; // Custom styles

const Testimonials = () => {
  const testimonials = [
    {
      name: 'DK Mukherjee',
      text: 'Interesting approach to facilitate online education,',
      designation: 'Teacher',
      image: 'https://media.istockphoto.com/id/1333001232/photo/portrait-of-indian-man-face-outdoors-looking-at-camera.jpg?s=612x612&w=0&k=20&c=Ne-OChwAEFF5U7yxOwUUqA8ELrJ1WCYho4RkW9v360I=',
    },
    {
      name: 'K Banerjee',
      text: 'Simple and Easy to use.',
      designation: 'Student',
      image: 'https://yogeshwarkasture.com/wp-content/uploads/2021/04/YGK_Human-Design-in-India_Human-Design_Yogeshwar-Kasture.009.jpeg',
    },
    {
      name: 'K Ganguly',
      text: 'Unique Concept for Self Learning and Assessment.',
      designation: 'Student',
      image: 'https://st2.depositphotos.com/4153545/8095/i/950/depositphotos_80951322-stock-photo-beautiful-young-indian-woman.jpg',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="testimonials-container">
      <h2>What Our Users Say</h2>
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" />
            <p className="testimonial-text">"{testimonial.text}"</p>
            <h3 className="testimonial-name">{testimonial.name}</h3>
            <p className="testimonial-designation">{testimonial.designation}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonials;
