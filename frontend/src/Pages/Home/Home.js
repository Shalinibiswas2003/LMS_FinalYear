import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "./Home.css";
import Testimonials from "../../Components/Testimonial/Testimonial";
import Footer from "../../Components/Footer/Footer";
import Slider from "../../Components/Slider/Slider";
import LearningIllustration from "../../Assets/LearningIllustration.jpg";
import Clock from "../../Assets/Clock.jpg";
import Homepg from "../../Assets/home.png";

function Home() {
  return (
    <div>
      <div className="nav" style={{ marginBottom: "2rem", height: "100%" }}>
        <Navbar />
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-left">
          <div className="hero-text">
            <div className="hero-heading">
              <h1>Learn on your schedule!</h1>
              <img src={Clock} alt="Clock" className="clock-icon" />
            </div>
            <p className="hero-subtext">Anywhere. Anytime. Start learning today!</p>
          </div>

          {/* Hexagon Section */}
          <div className="half-hexagon">
            <img src={Homepg} alt="" srcset="" style={{ width: "40rem" }} />
            {/* <svg className="hexagon-lines" width="100%" height="100%">
              <line x1="20%" y1="30%" x2="35%" y2="60%" stroke="black" strokeWidth="2" strokeDasharray="4" />
              <line x1="35%" y1="60%" x2="65%" y2="60%" stroke="black" strokeWidth="2" strokeDasharray="4" />
              <line x1="65%" y1="60%" x2="80%" y2="30%" stroke="black" strokeWidth="2" strokeDasharray="4" />
            </svg>
            

            <div className="logo-item logo1">
              <img src="/GPTTeacher.png" alt="Generate Course" />
              <p>Generate Your Course</p>
            </div>
            <div className="logo-item logo2">
              <img src="/BookIcon.png" alt="Learn and Study" />
              <p>Learn and Study</p>
            </div>
            <div className="logo-item logo3">
              <img src="/to-do-list.png" alt="Take Tests" />
              <p>Take Some Tests</p>
            </div>
            <div className="logo-item logo4">
              <img src="/CertificateIcon.png" alt="Certificate" />
              <p>Get Your Certificate!</p>
            </div>*/}
          </div>
        </div>

        <div className="hero-image">
          <img src={LearningIllustration} alt="Learning Illustration" />
        </div>
      </div>

      <Testimonials />
      <br />
      {/* <Slider /> */}

      {/* 👇 Two Boxes Below Slider */}
      {/* <div className="two-box-section">
        <div className="box left-box">
          <h3>Box One</h3>
          <p>This is the left box content.</p>
        </div>
        <div className="box right-box">
          <h3>Box Two</h3>
          <p>This is the right box content.</p>
        </div>
      </div> */}

      <Footer />
    </div>
  );
}

export default Home;
