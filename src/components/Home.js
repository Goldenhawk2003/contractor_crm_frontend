import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Home.css';


const Home = () => {
  const [searchText, setSearchText] = useState('');

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevents form submission if wrapped in a form element
      setSearchText(''); // Clears the input
    }
  };

  return (
    <div className="home-container">
      <h1 className="head">Welcome To Elite Crafts Contractors</h1>
      <p className="subhead">Your trusted platform for skilled contractors in every field.</p>
      
      <div class="search-bar-container">
  <input type="text" class="search-bar" placeholder="Search services: Plumbing, renovations, snow removal" />
  <button class="search-button">
  <i className="fas fa-search search-icon"></i>
  </button>
</div>
      
      <div className="services-buttons">
        
        <Link to="/ServiceRequest" className="service-button">Service Request</Link> 
        <Link to="/find-contractor" className='service-button'>Find a Contractor</Link>
      </div>
      <div className="Contractor-choices">
        <button type='submit'>Washroooms<img src="/images/download.png" alt="Bathroom Renovation Ideas" /></button>
        <button type='submit'>Washroooms<img src="/images/download.png" alt="Bathroom Renovation Ideas" /></button>
        <button type='submit'>Washroooms<img src="/images/download.png" alt="Bathroom Renovation Ideas" /></button>
        <button type='submit'>Washroooms<img src="/images/download.png" alt="Bathroom Renovation Ideas" /></button>
        <button type='submit'>Washroooms<img src="/images/download.png" alt="Bathroom Renovation Ideas" /></button>
        <button type='submit'>Washroooms<img src="/images/download.png" alt="Bathroom Renovation Ideas" /></button>
      </div>
      <div className='trust'>
        <h2 className='trust-header'>Trustworthy People, With reliable solutions
        </h2>
        <p className='trust-p'>Our quiz is designed to get the stress of looking for a contractor off your plate</p>

        <button type='submit' className='trust-button'>Take Quiz now</button>
      </div>
      <div className='our-process'> 
        <h2 className='our-header'>Our Process</h2>

      </div>
      <div className='match'>
        <h2 className='match-header'>Match With Our Professionals Today.</h2>
      </div>
    </div>
  );
};

export default Home;