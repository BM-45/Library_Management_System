import React from 'react';
import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo-section">
          <img src="path/to/logo.png" alt="Saint Louis University Logo" className="logo" />
          <p> Ramana Library</p>
          <p>EST. 1918</p>
        </div>
        <div className="tagline">
          <h2>Higher purpose. Greater good.</h2>
        </div>
        <div className="social-icons">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-linkedin-in"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-youtube"></i></a>
        </div>
        <div className="links">
          <a href="#">Parents & Families</a>
          <a href="#">Alumni</a>
          <a href="#">Donors</a>
          <a href="#">Faculty & Staff</a>
        </div>
        <div className="additional-links">
          
          <a href="#">Campus Map</a>
          
          <a href="#">Disclaimer</a>
          <a href="#">Emergency Info</a>
        </div>
        <div className="location">
          St. Louis, Missouri.
        </div>
        <div className="copyright">
          © 1918 - 2024 Ramana Library
        </div>
      </div>
    </footer>
  );
}

export default Footer;