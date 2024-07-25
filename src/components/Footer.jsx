import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="left-section">
          <h4>WAAAAAA go for elevators or lifts who cares</h4>
        </div>
        <div className="right-section">
          <div className="logo-section">
          </div>
          <div className="contact-section">
            <div className="contact-info">
              <h4>Need Some Help or mood</h4>
              <p>045-151-48-220</p>
            </div>
            <div className="social-media">
              <i className="fab fa-facebook"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-footer">
        <div className="links">
          <div>About Us</div>
          <div>Quality</div>
          <div>Contact Us</div>
        </div>
        <div className="terms">
          <p>Terms of Service</p>
          <p>Privacy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
