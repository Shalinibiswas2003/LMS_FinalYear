import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Slider from '../../Components/Slider/Slider';
import './Home.css'; // Create this file for the CSS
import Testimonials from '../../Components/Testimonial/Testimonial';
import Footer from '../../Components/Footer/Footer';


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
          <img src="/GPTTeacher.png" alt="CourseGen" />
          <p>Generate Your Course</p>
        </div>
        <div className="logo-item">
          <img src="/BookIcon.png" alt="Logo 2" />
          <p>Learn and Study</p>
        </div>
        <div className="logo-item">
          <img src="/to-do-list.png" alt="Logo 3" />
          <p>Take Some Tests</p>
        </div>
        <div className="logo-item">
          <img src="/CertificateIcon.png" alt="Logo 4" />
          <p>Get Your Certificate!</p>
        </div>
      </div>
      <Testimonials/>
      <br/>
      <Footer/>
    </div>
  );
}

export default Home;
