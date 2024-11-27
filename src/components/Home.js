import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Home.css';
import Fuse from 'fuse.js';


const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);

  const services = [
    { id: 1, name: 'Plumbing' },
    { id: 2, name: 'Renovations' },
    { id: 3, name: 'Snow Removal' },
    { id: 4, name: 'Electrical Work' },
    { id: 5, name: 'Carpentry' },
    { id: 6, name: 'Painting' },
  ];

  const fuse = new Fuse(services, {
    keys: ['name'], // Specify which field to search
    threshold: 0.3, // Adjust to control fuzziness
  });

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchText(value);

    if (value) {
      const results = fuse.search(value);
      setFilteredServices(results.map((result) => result.item));
    } else {
      setFilteredServices([]);
    }
  };
  return (
    <div className="home-container">
      <h1 className="head">Welcome To Elite Crafts Contractors</h1>
      <p className="subhead">Your trusted platform for skilled contractors in every field.</p>
      
      <div class="search-bar-container">
  <input type="text" class="search-bar" placeholder="Search services: Plumbing, renovations, snow removal" value={searchText}
          onChange={handleSearch} />
  <button class="search-button">
  <i className="fas fa-search search-icon"></i>
  </button>
</div>
{filteredServices.length > 0 && (
        <div className="search-results">
          <ul>
            {filteredServices.map((service) => (
              <li key={service.id}>{service.name}</li>
            ))}
          </ul>
        </div>
      )}
      
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