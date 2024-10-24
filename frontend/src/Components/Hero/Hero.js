import React from 'react';
import './Hero.css'; // Import the CSS file for styling

const Hero = ({ title, description, imageUrl }) => {
  return (
    <div className="hero" style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className="hero-overlay">
        <h1 className="hero-title">{title}</h1>
        {description && <div className="hero-description">{description}</div>} {/* Wrapped in a div */}
      </div>
    </div>
  );
};

export default Hero;
