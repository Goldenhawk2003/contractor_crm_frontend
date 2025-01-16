import React, { useState , useEffect} from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Fuse from 'fuse.js';


const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const navigate = useNavigate();
  

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
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchText.trim()) {
      navigate('/find-contractor', { state: { query: searchText.trim() } });
    }
  };

  const handleSearchButtonClick = () => {
    if (searchText.trim()) {
      navigate('/find-contractor', { state: { query: searchText.trim() } });
    }
  };

  const handleServiceClick = (serviceName) => {
    navigate('/find-contractor', { state: { query: serviceName } });
  };
  const quizButton = () => {
    navigate('/Quiz');
  }
  const requestButton = () => {
    navigate('/ServiceRequest');
  }
  useEffect(() => {
    // Add a class to the body for this specific page
    document.body.classList.add("specific-page");

    // Clean up by removing the class when the component is unmounted
    return () => {
      document.body.classList.remove("specific-page");
    };
  }, []);

   useEffect(() => {
          document.body.classList.add("transparent-navbar-page");
      
          return () => {
            document.body.classList.remove("transparent-navbar-page");
          };
        }, []);
        
  return (
    <div className="home-container">
      <div className="hero-section">
    <h1 className="head">Welcome To Elite Crafts Contractors</h1>
    <p className="subhead">Your trusted platform for skilled contractors in every field.</p>

    <div className="search-bar-container">
      <input
        type="text"
        className="search-bar"
        placeholder="Search services: Plumbing, renovations, snow removal"
        value={searchText}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
      <button
        className="search-button"
        onClick={handleSearchButtonClick}
        aria-label="Search"
        disabled={!searchText.trim()}
      >
        <i className="fas fa-search search-icon"></i>
      </button>
    </div>

    {filteredServices.length > 0 && (
      <div className="search-results">
        <ul>
          {filteredServices.map((service) => (
            <li key={service.id}>
              <button
                onClick={() => handleServiceClick(service.name)}
                className="service-link"
              >
                {service.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}

    <div className="services-buttons">
      <Link to="/Browse-contractors" className="service-button">
        Find A Contractor Now
      </Link>
    </div>
    <div className="Contractor-choices">
      <Link to="/find-contractor?type=Plumbing" className="contractor-choice-button">
        <img src="" alt="Plumbing Services" />
      </Link>
      <Link to="/find-contractor?type=Renovations" className="contractor-choice-button">
        <img src="" alt="Renovation Services" />
      </Link>
      <Link to="/find-contractor?type=Electrical" className="contractor-choice-button">
        <img src="" alt="Electrical Services" />
      </Link>
      <Link to="/find-contractor?type=Carpentry" className="contractor-choice-button">
        <img src="" alt="Carpentry Services" />
      </Link>
      <Link to="/find-contractor?type=Painting" className="contractor-choice-button">
        <img src="" alt="Painting Services" />
      </Link>
      <Link to="/find-contractor?type=Snow-removal" className="contractor-choice-button">
        <img src="" alt="Snow Removal Services" />
      </Link>
    </div>
  </div>
      <div className="trust">
  <div className="trust-content">
    <h2 className="trust-header">Trustworthy People, With Reliable Solutions</h2>
    <p className="trust-p">
      Our quiz is designed to get the stress of looking for a contractor off your plate.
    </p>
    <button type="submit" className="trust-button" onClick={quizButton}>
      Take Quiz Now
    </button>
   <button type='submit' className='trust-button' onClick={requestButton}>Request a Service</button>
  </div>
  <img src="" alt="Happy Contractors" className="contractor_img" />
</div>
      <div className='our-process'> 
        <h2 className='our-header'>Our Process</h2>
        <p className='process-p'>ECC is founded on the core principle of honest work by honest people. Our team is committed to sourcing dependable and high quality contractors for homeowners and businesses in the Durham Region. At ECC we do more than just connect people with services, we build lasting partnerships grounded in trust, mutual respect, and shared values.</p>
        
      </div>
      <div className='match'>
        <h2 className='match-header'>Match With Our Professionals Today.</h2>
   

<div className="contractor-list">
    <div key="1" className="contractor-card">
        <Link to="/contractor/sample-id" className="contractor-link">
            <img
                src=""
                alt="Contractor Logo"
                className="contractor-logo"
            />
            <p>
                <strong>Username:</strong> John Doe
            </p>
        </Link>
        <p>
            <strong>Job Type:</strong> Carpenter
        </p>
        <p>
            <strong>Experience:</strong> 5 years
        </p>
        <p>
            <strong>Rating:</strong> 
            <span className="stars">⭐⭐⭐⭐☆</span>
        </p>
        <p>
            <strong>Description:</strong> Skilled contractor with expertise in carpentry and home renovations.
        </p>
        <p>
            <strong>Location:</strong> Durham Region
        </p>
        <p>
            <strong>Hourly Rate: $</strong>50
        </p>
    </div>
    <div key="2" className="contractor-card">
        <Link to="/contractor/sample-id" className="contractor-link">
            <img
                src=""
                alt="Contractor Logo"
                className="contractor-logo"
            />
            <p>
                <strong>Username:</strong> Jane Smith
            </p>
        </Link>
        <p>
            <strong>Job Type:</strong> Plumber
        </p>
        <p>
            <strong>Experience:</strong> 8 years
        </p>
        <p>
            <strong>Rating:</strong> 
            <span className="stars">⭐⭐⭐⭐⭐</span>
        </p>
        <p>
            <strong>Description:</strong> Experienced plumber with excellent customer service skills.
        </p>
        <p>
            <strong>Location:</strong> Ajax, ON
        </p>
        <p>
            <strong>Hourly Rate: $</strong>60
        </p>
    </div>
    <div key="2" className="contractor-card">
        <Link to="/contractor/sample-id" className="contractor-link">
            <img
                src=""
                alt="Contractor Logo"
                className="contractor-logo"
            />
            <p>
                <strong>Username:</strong> Jane Smith
            </p>
        </Link>
        <p>
            <strong>Job Type:</strong> Plumber
        </p>
        <p>
            <strong>Experience:</strong> 8 years
        </p>
        <p>
            <strong>Rating:</strong> 
            <span className="stars">⭐⭐⭐⭐⭐</span>
        </p>
        <p>
            <strong>Description:</strong> Experienced plumber with excellent customer service skills.
        </p>
        <p>
            <strong>Location:</strong> Ajax, ON
        </p>
        <p>
            <strong>Hourly Rate: $</strong>60
        </p>
    </div>
    <div key="2" className="contractor-card">
        <Link to="/contractor/sample-id" className="contractor-link">
            <img
                src=""
                alt="Contractor Logo"
                className="contractor-logo"
            />
            <p>
                <strong>Username:</strong> Jane Smith
            </p>
        </Link>
        <p>
            <strong>Job Type:</strong> Plumber
        </p>
        <p>
            <strong>Experience:</strong> 8 years
        </p>
        <p>
            <strong>Rating:</strong> 
            <span className="stars">⭐⭐⭐⭐⭐</span>
        </p>
        <p>
            <strong>Description:</strong> Experienced plumber with excellent customer service skills.
        </p>
        <p>
            <strong>Location:</strong> Ajax, ON
        </p>
        <p>
            <strong>Hourly Rate: $</strong>60
        </p>
    </div>
    <div key="2" className="contractor-card">
        <Link to="/contractor/sample-id" className="contractor-link">
            <img
                src=""
                alt="Contractor Logo"
                className="contractor-logo"
            />
            <p>
                <strong>Username:</strong> Jane Smith
            </p>
        </Link>
        <p>
            <strong>Job Type:</strong> Plumber
        </p>
        <p>
            <strong>Experience:</strong> 8 years
        </p>
        <p>
            <strong>Rating:</strong> 
            <span className="stars">⭐⭐⭐⭐⭐</span>
        </p>
        <p>
            <strong>Description:</strong> Experienced plumber with excellent customer service skills.
        </p>
        <p>
            <strong>Location:</strong> Ajax, ON
        </p>
        <p>
            <strong>Hourly Rate: $</strong>60
        </p>
    </div>
    {/* Add more contractor cards here */}
</div>
      </div>
    </div>
  );
};

export default Home;