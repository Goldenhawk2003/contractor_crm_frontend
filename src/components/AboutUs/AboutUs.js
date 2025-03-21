import React, { useState, useEffect, useRef } from "react";
import "./AboutUs.css";
import AddressAutocomplete from "../APIStuff/AutoComplete";

const AboutUs = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handlePlaceSelected = (place) => {
    setSelectedPlace(place);
    console.log('Selected place:', place);
    // You can extract specific details from the "place" object here
  };
  return (
    <div>
      {/* About Us Section */}
      <div className="our-mission">
      <div className="mission-container">
       <img src="/images/5163DC0D-2DD9-4D70-87C3-DE31114A455F.jpeg" className="mission-image" alt="About Us" />
       </div>
      </div>

      {/* Our Impact Section */}
      <section className="impact-section">
        <div className="impact-container">
          <h2 className="impact-title">
            Our Impact <span className="impact-line"></span>
          </h2>

          <div className="impact-content">
      <ImpactCard number={800} text="Active & Trusted Contractors" delay={0} />
      <ImpactCard number={1400} text="Successfully Finished Jobs" delay={500} />
      <ImpactCard number={500} text="Happy Community Members" delay={1000} />
      <ImpactCard number={1} text="Community-based Elite Contracting Platform." delay={1500} />
    </div>
        </div>
      </section>

      <div className="our-story">
  <div className="story-container">
    <h2 className="story-title">Our Story</h2>
    <div className="story-text-container">
      <p className="story-text">
        Elite Craft Contractors was built on the commitment to delivering honest, high-quality work to clients who value integrity and trust. As a homeowner in the Durham Region, it is an ongoing problem to find respectable and qualified contractors.
      </p>
      <p className="story-text">
        ECC was created to comfort and inspire home and business owners while connecting with professionals who maintain loyalty to Durham Region’s community.
      </p>
    </div>
  </div>
</div>

<div className="our-mission">
  <div className="mission-container">
   <img src="/images/Our-Story-icons-01.png" alt="Our Mission" className="mission-image" />
    </div>
</div>
<div className="our-mission">
  <div className="mission-container">
    <img src="/images/About-Us-Page-01.png" alt="Our Mission" className="mission-image" /> 
 
    </div>
    </div>
    <div>
      <h2>Enter Your Address</h2>
      <AddressAutocomplete onPlaceSelected={handlePlaceSelected} />
      {selectedPlace && (
        <div>
          <h3>Selected Address Details:</h3>
          <p>{selectedPlace.formatted_address}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>



    </div>
  );
};

const ImpactCard = ({ number, text, delay }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const speed = 10; // Fixed speed for all numbers
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setTimeout(() => {
              let start = 0;
              const increment = number / 100; // Keeps counting smooth
  
              const timer = setInterval(() => {
                start += increment;
                if (start >= number) {
                  setCount(number);
                  clearInterval(timer);
                } else {
                  setCount(Math.ceil(start));
                }
              }, speed);
  
              return () => clearInterval(timer);
            }, delay); // 🔥 Introduces the delay
          }
        },
        { threshold: 0.5 }
      );
  
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, [number, delay]);
  
    return (
      <div className="impact-card" ref={ref}>
        <span className="impact-number">{count.toLocaleString()}+</span>
        <p className="impact-text">{text}</p>
      </div>
    );
  };

export default AboutUs;