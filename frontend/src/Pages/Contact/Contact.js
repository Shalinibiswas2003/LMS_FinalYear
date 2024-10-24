import React from 'react';
import Hero from '../../Components/Hero/Hero';
import Navbar from '../../Components/Navbar/Navbar';
import EnquirySection from '../../Components/EnquirySection/EnquirySection'; // Import the EnquirySection component
import FAQSection from '../../Components/FAQSection/FAQSection'; // Import the FAQSection component
import Footer from '../../Components/Footer/Footer';
import './Contact.css'; // Import the CSS file

function Contact() {
  return (
    <div>
      <Navbar />
      <Hero
        title="REACH US AT!"
        description={
            <>
              <i className="fas fa-envelope"></i> info@example.com
              <br />
              <br />
              <i className="fas fa-phone"></i> +123-456-7890
            </>
          }
        imageUrl="https://res.cloudinary.com/demo/image/upload/flower.jpg"
      />
      <div className="contact-container">
        <EnquirySection />
        <FAQSection />
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
