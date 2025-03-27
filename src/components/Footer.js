import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p className='connect'>Connect with us:</p>
      <div className="social-links">
        <Link to={{ pathname: "https://www.facebook.com" }} target="_blank" className="social-icon">
          <i className="fab fa-facebook-f"></i>
        </Link>
        <Link to={{ pathname: "https://www.twitter.com" }} target="_blank" className="social-icon">
          <i className="fab fa-twitter"></i>
        </Link>
        <Link to={{ pathname: "https://www.instagram.com" }} target="_blank" className="social-icon">
          <i className="fab fa-instagram"></i>
        </Link>
        <Link to={{ pathname: "https://www.linkedin.com/in/elitecraftcontractors" }} target="_blank" className="social-icon">
          <i className="fab fa-linkedin-in"></i>
        </Link>
      </div>
      <img src={`${process.env.PUBLIC_URL}/images/logos/7CC11B70-FC2A-4309-944C-557B428CE805.png`} alt="Logo" height="50px"/>
      <p className='sunni'>A Sunni Studios Product</p>
    </footer>
  );
};

export default Footer;