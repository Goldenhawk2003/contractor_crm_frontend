import React, { useState , useEffect,useRef} from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Fuse from 'fuse.js';

const services = [
  {
    title: "Discover Our Exclusive Contractors",
    description:
      "Explore our service categories, discover top trades and connect with Exclusive Contractors today!"
  },
  {
    title: "Complete Our Quick Questionnaire",
    description:
      "Let’s find your match! Complete our simplified questionnaire to help our team connect you with an Exclusive Contractor who fits your project needs, timeline, and budge"
  },
  {
    title: "Chat With Us",
    description:
      "Chat directly with Exclusive Contractors. Ask questions, share your vision, and get the support you need."
  },
  {
    title: "Finalize & Secure Your Projects",
    description:
      "Secure your contracts with full privacy and protection directly on our platform. Payments are safely handled through Stripe Connect, a trusted system that protects both clients and contractors"
  }
];

const ServicesAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="we-offer">

      <div className="services-container-accordion">
        {services.map((item, index) => (
          <div key={index} className="accordion-item">
            <button className="accordion-header" onClick={() => toggle(index)}>
              {item.title}
              <span className={`arrow ${activeIndex === index ? 'open' : ''}`}>
                {activeIndex === index ? '▲' : '▼'}
              </span>
            </button>
            <div
              className={`accordion-content-wrapper ${
                activeIndex === index ? 'open' : ''
              }`}
            >
              <div className={`accordion-content ${activeIndex === index ? 'visible' : ''}`}>
                <p>{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const navigate = useNavigate();
  const [contractors, setContractors] = useState([]); // State for contractors


  
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contractors/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch contractors.');
        }

        const data = await response.json();
        setContractors(data);
      } catch (err) {
        setError('Could not fetch contractors. Please try again later.');
      }
    };

    fetchContractors();
  }, []);

  // Find the specific contractor (e.g., with ID 20)
  const specificContractor = contractors.find((contractor) => contractor.id === 5);
  const specificContractor2 = contractors.find((contractor) => contractor.id === 3);
  const specificContractor3 = contractors.find((contractor) => contractor.id === 2);
  const specificContractor4 = contractors.find((contractor) => contractor.id === 6);
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };



  // Search Button
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



  // Different navigation buttons
  const handleServiceClick = (serviceName) => {
    navigate('/find-contractor', { state: { query: serviceName } });
  };
  const quizButton = () => {
    navigate('/quiz');
  }
  const requestButton = () => {
    navigate('/ServiceRequest');
  }
  const BrowseButton = () => {
    navigate('/Browse-Contractors');
  }
  const blogButton = () => {
    navigate('/Blogs');
  }
  const tutButton = () => {
    navigate('/Tutorials');
  }
  const aboutUsButton = () => {
    navigate('/AboutUs');
  }

//photo carousel
const images = [
  '/images/stock-house/0B4D9E08-F91D-433E-AC46-40F32C86F1CD_1_105_c.jpeg',
  '/images/stock-house/3C8E5964-8DED-40EF-A128-73CE20780B07_1_105_c.jpeg',
  '/images/stock-house/3D6C2DF2-C348-49DD-889D-2C7E8A82C405_1_105_c.jpeg',
  '/images/stock-house/5E385793-743C-4A38-9FBB-49D4DC4BF074.jpeg',
  '/images/stock-house/006A48FE-63D7-4D02-B8FA-3ACC8A1D18F1_1_105_c.jpeg',
  '/images/stock-house/6C46E0A3-AD1F-4596-8439-DE56C7DA50D6_1_105_c.jpeg',
  '/images/stock-house/37C55748-E702-4732-AF44-B4396C95B0AA_1_105_c.jpeg',
  '/images/stock-house/534C7222-DE85-457B-87D6-98D200781608_1_105_c.jpeg',
  '/images/stock-house/47213244-E864-42C5-93FE-FAEE5D627772_1_105_c.jpeg',
  '/images/stock-house/AAEF9AB0-80B1-42D3-989B-03986C13A471_1_105_c.jpeg'
];
const doubledImages = images.concat(images);


   



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
    <div className="hero-background">
    <video autoPlay
  muted
  loop
  playsInline className="background-video">

    <source src="/images/8395EF79-AFDD-45AB-ADB5-F131337CCDF6.MP4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <video
    autoPlay
    muted
    loop
    playsInline
    className="background-video-mobile-only"
  >
    <source src="/images/4ACF8FF5-EDEE-437B-BA24-1B703CE8BB75.mov" type="video/mp4" />
  </video>

  <div className="hero-content">
      <h1 className="Hero-header">
        <span className="highlight-header">Exclusive</span> Trade Network
      </h1>
      <p className="Hero-p">Connecting Trusted Contractors With Quality Projects</p>

    </div>
    <div className="scroll-down-arrow" onClick={() => document.getElementById('why-choose-us').scrollIntoView({ behavior: 'smooth' })}>
      ↓
      </div>
    
  </div>

  <div className="trust">
  <div className="trust-content">
  <h1 className="trust-header">
  Take Our 1 Minute Questionnaire To Find Your <span className='highlight'>Exclusive Contractor</span> Today!
</h1>
    
    <button type="submit" className="trust-button-services" onClick={quizButton}>
     Find My Match Now!
    </button>
    
  </div>
 
</div>

<div className='our-process' id="why-choose-us"> 
        <h2 className='our-header'>Why Choose Us?</h2>
        <div className='our-process-box'>
        <img className='process-img' src="/images/home-page/diversity-collaboration-laughing-and-architect-te-2023-11-27-04-49-54-utc.jpeg" />
        <div className='our-process-text'>
        <p className='our-process-p'>Exclusive Trade Network (ETN) was built on the commitment to delivering honest, high-quality work to clients who value integrity and trust. As home and business owners in the Durham Region, we acknowledge how challenging it can be to find respectable and qualified contractors.
        </p>
        <p className='our-process-p'>ETN was created to comfort and inspire home and business owners while connecting with professionals who maintain loyalty to Durham Region’s community as well as the GTA. 
        </p>
        <button type='submit' className='trust-button-services' onClick={aboutUsButton}>Learn More</button>
        </div>
        </div>


      </div>

  <div className='services-section'>
    <div className='services-header-box'>
    <h1 className='service-header'>What Services Are You Looking For?</h1>
    </div>
 
  <div className="search-bar-container">
      <input
        type="text"
        className="search-bar-home"
        placeholder="Search services: Plumbing, renovations, snow removal"
        value={searchText}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
      <button
        className="search-button-home"
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

    <div className='services-box'>
      <h3 className='service-h3'>Discover With Us</h3>
      </div>
     
    <div className="icons-search-container">
   
      <Link to="/quiz" className="icons-search" state={{ prefillAnswer: "Electrical Services", questionType: "text_image", questionIndex: 1 }}>
      <div class="icon-stack">
        <img src="/images/home-page/search-icons/light-bulb.png" alt="Electrical Services" class="icon light"/>
        <img src="/images/home-page/search-icons/dark-bulb.png" alt="Electrical Services" className="icon dark" />
        </div>
        <p>Electrical</p>
      </Link>


      <Link 
  to="/quiz" 
  className="icons-search"
  state={{ prefillAnswer: "Landscaping", questionType: "text_image", questionIndex: 1 }}  // Second question (index 1)
>
<div class="icon-stack">
  <img src="/images/home-page/search-icons/light-door.png" alt="Fireplace Services" class="icon light" />
  <img src="/images/home-page/search-icons/dark-door.png" alt="Fireplace Services" class="icon dark" />
  </div>
  <p>Landscaping</p>
</Link>


      <Link to="/quiz" className="icons-search" state={{ prefillAnswer: "Decks & Fences", questionType: "text_image", questionIndex: 1 }} >

      <div class="icon-stack">
        <img src="/images/home-page/search-icons/light-fence.png" alt="Fence Services" class="icon light"/>
        <img src="/images/home-page/search-icons/dark-fence.png" alt="Fence Services"class="icon dark" />
        </div>
        <p>Decks & Fences</p>
      </Link>



      <Link to="/quiz" className="icons-search" state={{ prefillAnswer: "Renovations", questionType: "text_image", questionIndex: 1 }}>
      <div class="icon-stack">
        <img src="/images/home-page/search-icons/light-shower.png" alt="shower"  className='icon light'/>
        <img src="/images/home-page/search-icons/dark-shower.png" alt="shower" className='icon dark' />
        </div>
        <p>Renovations</p>
      </Link>
     
<Link 
  to="/quiz" 
  className="icons-search"
  state={{ prefillAnswer: "General Contracting", questionType: "text_image", questionIndex: 1 }}  // Second question (index 1)
>
<div class="icon-stack">
  <img src="/images/home-page/search-icons/light-stove.png" alt="Appliance Services" className='icon light' />
  <img src="/images/home-page/search-icons/dark-stove.png" alt="Appliance Services" className="icon dark" />
  </div>
  <p>General Contracting</p>
</Link>
<Link 
  to="/quiz" 
  className="icons-search"
  state={{ prefillAnswer: "Plumbing Services", questionType: "text_image", questionIndex: 1 }}  // Second question (index 1)
>
<div class="icon-stack">
  <img src="/images/home-page/search-icons/light-sink.png" alt="Plumbing Services" className='icon light' />
  <img src="/images/home-page/search-icons/dark-sink.png" alt="Plumbing Services" className="icon dark" />
  </div>
  <p>Plumbing</p>
</Link>


      
    </div>

    
  </div>


<div className='services-box-accordion'>
  <h1 className='we-offer-header'>How It Works</h1>
  <div className='we-offer-image-box'>
      <ServicesAccordion />
    <img className='we-offer-img' src="/images/home-page/AdobeStock_420698353.jpeg" />
    </div>
</div>

   
      
   




      <div className='match'>
        <h2 className='match-header'>Match With Our Professionals Today</h2>
        <ul className="contractor-list">
        {specificContractor ? (
     <li key={specificContractor.id} className="contractor-card-prof">
     <Link to={`/contractor/${specificContractor.id}`} className="contractor-link-prof">
         {specificContractor.logo && (
             <img
                 src={specificContractor.logo || '/placeholder.png'}
                 alt={`${specificContractor.username || specificContractor.name} Logo`}
                 className="contractor-logo-prof"
             />
         )}
     </Link>
     
     <div className="contractor-info-prof">
     <div className="contractor-details-prof">
         <h3 className="contractor-name-prof">{specificContractor.username || 'Unknown'}</h3>
         <p className="contractor-stars-prof">{renderStars(specificContractor.rating)}</p>
         </div>
         <div className="contractor-details-prof">
             <p>{specificContractor.job_type || 'N/A'}</p>
             <p className="contractor-rating-prof">{specificContractor.rating || '0'}/5</p>
         </div>
        
     </div>
 </li>
) : (
    <p>Contractor not found</p>
)}

{specificContractor2 ? (
    <li key={specificContractor2.id} className="contractor-card-prof">
    <Link to={`/contractor/${specificContractor2.id}`} className="contractor-link-prof">
        {specificContractor2.logo && (
            <img
                src={specificContractor2.logo || '/placeholder.png'}
                alt={`${specificContractor2.username || specificContractor2.name} Logo`}
                className="contractor-logo-prof"
            />
        )}
    </Link>
    
    <div className="contractor-info-prof">
    <div className="contractor-details-prof">
        <h3 className="contractor-name-prof">{specificContractor2.username || 'Unknown'}</h3>
        <p className="contractor-stars-prof">{renderStars(specificContractor2.rating)}</p>
        </div>
        <div className="contractor-details-prof">
            <p>{specificContractor2.job_type || 'N/A'}</p>
            <p className="contractor-rating-prof">{specificContractor2.rating || '0'}/5</p>
        </div>
       
    </div>
</li>
) : (
    <p>Contractor not found</p>
)}

{specificContractor3 ? (
     <li key={specificContractor3.id} className="contractor-card-prof">
     <Link to={`/contractor/${specificContractor3.id}`} className="contractor-link-prof">
         {specificContractor3.logo && (
             <img
                 src={specificContractor3.logo || '/placeholder.png'}
                 alt={`${specificContractor3.username || specificContractor3.name} Logo`}
                 className="contractor-logo-prof"
             />
         )}
     </Link>
     
     <div className="contractor-info-prof">
     <div className="contractor-details-prof">
         <h3 className="contractor-name-prof">{specificContractor3.username || 'Unknown'}</h3>
         <p className="contractor-stars-prof">{renderStars(specificContractor3.rating)}</p>
         </div>
         <div className="contractor-details-prof">
             <p>{specificContractor3.job_type || 'N/A'}</p>
             <p className="contractor-rating-prof">{specificContractor3.rating || '0'}/5</p>
         </div>
        
     </div>
 </li>
) : (
    <p>Contractor not found</p>
)}

{specificContractor4 ? (
    <li key={specificContractor4.id} className="contractor-card-prof">
    <Link to={`/contractor/${specificContractor4.id}`} className="contractor-link-prof">
        {specificContractor4.logo && (
            <img
                src={specificContractor4.logo || '/placeholder.png'}
                alt={`${specificContractor4.username || specificContractor4.name} Logo`}
                className="contractor-logo-prof"
            />
        )}
    </Link>
    
    <div className="contractor-info-prof">
    <div className="contractor-details-prof">
        <h3 className="contractor-name-prof">{specificContractor4.username || 'Unknown'}</h3>
        <p className="contractor-stars-prof">{renderStars(specificContractor4.rating)}</p>
        </div>
        <div className="contractor-details-prof">
            <p>{specificContractor4.job_type || 'N/A'}</p>
            <p className="contractor-rating-prof">{specificContractor4.rating || '0'}/5</p>
        </div>
       
    </div>
</li>
) : (
    <p>Contractor not found</p>
)}
  </ul>
      </div>




     <div class="testimonials-section">

  <div class="testimonials-header">
    <h2>Hear It From Our Clients</h2>
  </div>


  <div class="testimonials-container">
    <div class="testimonial-card">
      <p class="testimonial-text">"From start to finish, everything went smoothly! I’ll definitely use ETN again for future projects!"</p>
      <div class="testimonial-rating-test">
        <div class="stars">★★★★★</div>
        <p class="client-name">-James P., Pickering, ON</p>
      </div>
    </div>
    <div class="testimonial-card">
      <p class="testimonial-text">"The contractor that was hired for my backyard home project was creative, professional, and affordable! Couldn’t be happier with the results!
"</p>
      <div class="testimonial-rating">
        <div class="stars">★★★★★</div>
        <p class="client-name">-Amy S., Oshawa, ON</p>
      </div>
    </div>
    <div class="testimonial-card">
      <p class="testimonial-text">"Everyone I spoke to was kind, responsive, and helped fix the roof of my business so fast that I reopened the next day!
"</p>
      <div class="testimonial-rating">
        <div class="stars">★★★★★</div>
        <p class="client-name">-Priya D., Ajax, ON</p>
      </div>
    </div>
    <div class="testimonial-card">
      <p class="testimonial-text">"Finally, a local site that actually connects you with contractors you can trust!"</p>
      <div class="testimonial-rating">
        <div class="stars">★★★★★</div>
        <p class="client-name">-Mark L., Whitby, ON</p>
      </div>
    </div>
    <div class="testimonial-card">
      <p class="testimonial-text">"My husband and I thank the ETN team! Everyone was very helpful and answered all our questions with patience and care."</p>
      <div class="testimonial-rating">
        <div class="stars">★★★★★</div>
        <p class="client-name">-Sandra M., Courtice, ON</p>
      </div>
    </div>
    <div class="testimonial-card">
      <p class="testimonial-text">"ETN made it easy to find a reliable contractor. Our reno was on time, under budget, and less stressful with the guidance from the contractor."</p>
      <div class="testimonial-rating">
        <div class="stars">★★★★★</div>
        <p class="client-name">-Leo, B., Bowmanville, ON</p>
      </div>
    </div>
  </div>

</div>

<div className='Explore'>
    <h1 className='Explore-header'>Need Some Inspo?</h1>
    <div className="scroll-carousel-wrapper">
      <div className="scroll-carousel-track">
        {doubledImages.map((src, i) => (
          <img key={i} src={src} alt={`carousel-${i}`} className="scroll-carousel-image" />
        ))}
      </div>
    </div>
<div className="inspo-button-wrapper">
    <button type="submit" className="inspo-button-home" onClick={tutButton}>
      Browse All
    </button>
  </div>
  </div>

  <div className='About-us-home'>
  <div className="About-us-content">
    <img src="/images/F2E56999-2D4E-4BDF-A9E2-9493EA1BD1C1_1_105_c.jpeg" className='About-us-home-img' />
    
    <div className="About-us-text-container">
      <h1 className='About-us-header'>Meet Your Advocates</h1>
      <p className='About-us-text'>
        At Exclusive Trade Network, we put your needs first, and we’re driven by our community. Read more, and say hello!
      </p>
      <img src="/images/F2E56999-2D4E-4BDF-A9E2-9493EA1BD1C1_1_105_c.jpeg" className='About-us-home-img-phone' />
  
    </div>
  </div>
</div>


    </div>
  );
};

export default Home;