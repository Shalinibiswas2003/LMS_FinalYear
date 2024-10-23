import React from 'react';
import './Hero.css'; // Import the CSS file for styling

const Hero = ({ title, imageUrl }) => {
  return (
    <div className="hero" style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className="hero-overlay">
        <h1 className="hero-title">{title}</h1>
      </div>
    </div>
  );
};

export default Hero;
