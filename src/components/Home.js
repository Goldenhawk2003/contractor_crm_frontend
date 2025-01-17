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
  const BrowseButton = () => {
    navigate('/Browse-Contractors');
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
    <h1 className='Hero-header'>Your Trusted Partners</h1>
    <h1 className='Hero-header'>at Elite Craft.</h1>
  </div>

  <div className="trust">
  <div className="trust-content">
    <h1 className="trust-header">Trustworthy People, With Reliable Solutions.</h1>
    <p className="trust-p">
      Our quiz is designed to get the stress of looking for a contractor off your plate.
    </p>
    <button type="submit" className="trust-button" onClick={quizButton}>
      How-To Guide
    </button>
  </div>
  <img src="/images/home-page/Mission-block-image.png" alt="Happy Contractors" className="contractor_img" />
</div>

  <div className='services-section'>
    <div className='services-header-box'>
    <h1 className='service-header'>What Services are You Looking For?</h1>
    </div>
 
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

    <div>
      <h3 className='service-h3'>Discover With Elite</h3>
      <p className='service-p'><button type="submit" className="service-p" onClick={BrowseButton}> View All </button></p>
      </div>
     
    <div className="Contractor-choices">
   
      <Link to="/find-contractor?type=Plumbing" className="contractor-choice-button">
        <img src="/images/home-page/Services-section-card1.png" alt="Plumbing Services" />
      </Link>
      <Link to="/find-contractor?type=Renovations" className="contractor-choice-button">
        <img src="/images/home-page/Services-section-card2.png" alt="Renovation Services" />
      </Link>
      <Link to="/find-contractor?type=Electrical" className="contractor-choice-button">
        <img src="/images/home-page/Services-section-card3.png" alt="Electrical Services" />
      </Link>
      <Link to="/find-contractor?type=Electrical" className="contractor-choice-button">
        <img src="/images/home-page/Services-section-card4.png" alt="Electrical Services" />
      </Link>
      
    </div>

    
  </div>

  <div class="we-offer">
  <h2 class="we-offer-header">Our Services.</h2>
  <div class="services-container">
    <div class="service">
      <div class="service-icon">1</div>
      <h3 class="service-title">Discover</h3>
      <p class="service-description">
        Using our categories, search up different services you are looking for. Our skilled contractors will pop up, and you can decide to chat with them!
      </p>
    </div>
    <div class="service">
      <div class="service-icon">2</div>
      <h3 class="service-title">Quiz</h3>
      <p class="service-description">
        Can’t find what you’re looking for? Take our advanced quiz to find results tailored to your needs.
      </p>
    </div>
    <div class="service">
      <div class="service-icon">3</div>
      <h3 class="service-title">Chat</h3>
      <p class="service-description">
        Look through our contractors and chat with them to learn more!
      </p>
    </div>
    <div class="service">
      <div class="service-icon">4</div>
      <h3 class="service-title">Contracts</h3>
      <p class="service-description">
        Lock in your contracts with your service provider directly on our site. We ensure protection and privacy and deliver with solutions.
      </p>
    </div>
  </div>
</div>
   
      
      <div className='our-process'> 
        <h2 className='our-header'>Why Choose Us?</h2>
        <p className='process-p'>ECC is founded on the core principle of honest work by honest people. Our team is committed to sourcing dependable and high quality contractors for homeowners and businesses in the Durham Region. At ECC we do more than just connect people with services, we build lasting partnerships grounded in trust, mutual respect, and shared values.</p>
      </div>




      <div className='match'>
        <h2 className='match-header'>Match With Our Professionals Today.</h2>
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
   


      </div>
    </div>
  );
};

export default Home;