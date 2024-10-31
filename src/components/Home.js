import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
        <h1 className="head">Welcome To Elite Crafts Contractors</h1>
      <div className="button-group">
        <button className="nav-button">Become a Contractor</button>
        <button className="nav-button">Jobs</button>
        <button className="nav-button">Login/Signup</button>
      </div>
      <div className="search-bar-container">
        <input type="text" className="search-bar" placeholder="Plumbing, renovations, snow removal" />
        <i className="fas fa-search search-icon"></i>
      </div>
    </div>
  );
};

export default Home;