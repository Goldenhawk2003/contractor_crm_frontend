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
      <div className="footer-section">
  <h4>Legal</h4>
  <ul>
    <li><a href="/privacy-policy">Privacy Policy</a></li>
    <li><a href="/terms">Terms & Conditions</a></li>
  </ul>
</div>
<div className="footer-section-second">
  <div className="footer-section-third">
      <img src={`${process.env.PUBLIC_URL}/images/logos/B9E77BF2-4615-4CFA-B96C-BE8D00092A91.png`} alt="Logo" height="80px" className='footer-logo'/>
      <p className='sunni'>A Sunni Studios Product</p>
  </div>
      <img src={`${process.env.PUBLIC_URL}/images/logos/Stripe_(company)-Powered-by-Stripe-Outline-Logo.wine.svg`} alt="Powered by Stripe" className='stripe-logo' />
      </div>
     
    </footer>
  );
};

export default Footer;