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
      
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search services: Plumbing, renovations, snow removal"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <i className="fas fa-search search-icon"></i>
      </div>

      <div className="services-buttons">
        
        <Link to="/ServiceRequest" className="service-button">Service Request</Link> 
        <Link to="/find-contractor" className='service-button'>Find a Contractor</Link>
      </div>
    </div>
  );
};

export default Home;