import React from 'react';
import './Footer.css'; // Make sure to create a CSS file for styling

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} CompanyName. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
