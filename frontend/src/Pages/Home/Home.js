import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Slider from '../../Components/Slider/Slider';
import './Home.css'; // Create this file for the CSS
import Testimonials from '../../Components/Testimonial/Testimonial';

function Home() {
  return (
    <div>
      <div className="nav" style={{ marginBottom: '2rem', height: '100%' }}>
        <Navbar />
      </div>
      <Slider />
      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo-item">
          <img src="https://via.placeholder.com/150x100?text=Logo+1" alt="Logo 1" />
          <p>Logo 1</p>
        </div>
        <div className="logo-item">
          <img src="https://via.placeholder.com/150x100?text=Logo+2" alt="Logo 2" />
          <p>Logo 2</p>
        </div>
        <div className="logo-item">
          <img src="https://via.placeholder.com/150x100?text=Logo+3" alt="Logo 3" />
          <p>Logo 3</p>
        </div>
        <div className="logo-item">
          <img src="https://via.placeholder.com/150x100?text=Logo+4" alt="Logo 4" />
          <p>Logo 4</p>
        </div>
      </div>
      <Testimonials/>
    </div>
  );
}

export default Home;
