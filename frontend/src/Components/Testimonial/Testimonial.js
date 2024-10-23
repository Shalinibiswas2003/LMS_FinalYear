import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Testimonial.css'; // Custom styles

const Testimonials = () => {
  const testimonials = [
    {
      name: 'John Doe',
      text: 'Amazing experience! The Andaman Islands were beautiful, and the service was fantastic.',
      designation: 'Travel Blogger',
      image: 'https://via.placeholder.com/100',
    },
    {
      name: 'Jane Smith',
      text: 'A perfect destination for a honeymoon. We loved every moment of it.',
      designation: 'Designer',
      image: 'https://via.placeholder.com/100',
    },
    {
      name: 'Michael Brown',
      text: 'Great service and a beautiful location. Would recommend to anyone!',
      designation: 'Photographer',
      image: 'https://via.placeholder.com/100',
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
