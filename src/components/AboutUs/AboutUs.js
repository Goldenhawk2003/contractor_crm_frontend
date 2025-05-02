import React, { useState, useEffect, useRef } from "react";
import "./AboutUs.css";
import GooglePlacesInput from "../APIStuff/AutoComplete";

const storyParagraphs = [
  `“In the early 1950’s, my family immigrated from Italy to Canada hoping to create a better future for the generations that followed. My grandparents started working in farming, mining, and factories prior to entering the construction and real estate industry in Durham Region in the late 60’s. My grandfather always said “Canada is the best country in the world,” emphasizing the opportunities it provided for work and starting a family. Following in his footsteps, my father continued in construction and real estate, carrying on the values of hard work, motivation, and a deep appreciation for Canada.`,
  "Although we are grateful for what Canada has to offer, one ongoing challenge that my family has faced for decades is finding reliable and gifted contractors. Time and time again we’ve encountered contractors who misrepresent their skills and capabilities, leading to consistent uncertainty and frustration.",
  "I started this company to support and inspire home and business owners. My goal is to connect customers with trusted professionals who maintain loyalty to Durham Region’s community. It is my turn to continue sharing my family's passion for construction and helping the people in my community. I am proud to continue the values that have been the foundation of our family's success for generations.”",

];
const items = [
  {
    title: "Transparent and Secure Transactions",
    text: "With ETN, clients can expect clear, upfront pricing and secure payment methods creating trust and satisfaction.​",
    image: "/images/icons/Our-Story-icons-02.png",
  },
  {
    title: "Tailored Matchmaking for Projects",
    text: " ETN's platform matches clients with contractors whose expertise aligns perfectly with the project's requirements.",
    image: "/images/icons/Our-Story-icons-03.png",

  },
  {
    title: "Exclusive Network of Trusted Professionals",
    text: "ETN carefully hand-picks each contractor through a strict hiring process, guaranteeing clients access to only the most dependable and highly skilled professionals.",
    image: "/images/icons/Our-Story-icons-04.png",

  },
  {
    title: "Ongoing Support and Accountability",
    text: "ETN provides continuous oversight throughout the project lifecycle addressing any concerns promptly and ensuring high standards are ",
    image: "/images/icons/Our-Story-icons-05.png",

  }
];

const Accordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="elegant-section">
      <div className="elegant-left">

        {items.map((item, index) => (
          <div key={index} className="elegant-item">
            <button className="elegant-header" onClick={() => toggle(index)}>
              {item.title}
              <span className="arrow">{activeIndex === index ? "▲" : "▼"}</span>
            </button>
            <hr />
            <div className={`elegant-content-wrapper ${activeIndex === index ? 'open' : ''}`}>
            <div className={`elegant-content ${activeIndex === index ? 'visible' : ''}`}>
  <p>{item.text}</p>
</div>
</div>
          </div>
        ))}
      </div>

      <div className="elegant-right">
      <img
  src={activeIndex !== null ? items[activeIndex].image : "/images/logos/B9E77BF2-4615-4CFA-B96C-BE8D00092A91.png"}
  alt={activeIndex !== null ? items[activeIndex].title : "Default"}
  className="elegant-image" loading="lazy"
/>
      </div>
    </div>
  );
};
const AboutUs = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleAddressSelected = (place) => {
    console.log('Selected place:', place);
  };

  const [currentCard, setCurrentCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % storyParagraphs.length);
    }, 30000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % storyParagraphs.length);
  };

  const handlePrev = () => {
    setCurrentCard((prev) => (prev - 1 + storyParagraphs.length) % storyParagraphs.length);
  };

  useEffect(() => {
      // Add a class to the body for this specific page
      document.body.classList.add("specific-page-about-us");
  
      // Clean up by removing the class when the component is unmounted
      return () => {
        document.body.classList.remove("specific-page-about-us");
      };
    }, []);
  return (
    <div className="about-us-page">
      {/* About Us Section */}
      <div className="our-mission-first">
      <div className="mission-container-first">
        <div className="mission-image-container">

        <h2>Leading the Way in Trust and Community.</h2>
        <p>We believe that great service starts with a strong, connected and inspired community.</p>
        </div> 
        <img src="/images/image.png" className="mission-image-first" alt="About Us" />
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
      <ImpactCard number={1} text="Community Based Exclusive Trade Contracting Platform" delay={1500} />
    </div>
        </div>
      </section>

      <div className="flashcard-container">
        <h1 className="flashcard-title">Our Founder's Story</h1>
      <div className="flashcard">
      <button onClick={handlePrev} className="flashcard-buttons">&#8592;</button>
    
        <p className="flashcard-text">
  {storyParagraphs[currentCard]}
  {currentCard === 2 && (
    <>
      <br />
      <br />
      Vincent Bavaro, Owner and Founder of Exclusive Trade Network
    </>
  )}
</p>
        <button onClick={handleNext} className="flashcard-buttons">&#8594;</button>
      </div>
      <div className="flashcard-mobile">
      <button onClick={handlePrev} className="flashcard-buttons-mobile">&#8592;</button>
      <button onClick={handleNext} className="flashcard-buttons-mobile">&#8594;</button>
</div>
    </div>
    <h2 className="elegant-title">Our Mission</h2>
    <Accordion />
<div className="our-mission">
  <div className="mission-container">
    <img src="/images/About-Us-Page-01.png" alt="Our Mission" className="mission-image-our" /> 
    <img src="/images/D38C1EB3-8FBE-43C1-B763-46F526D03044_1_201_a.jpeg" alt="Our Mission" className="mission-image-mobile" />
 
    </div>
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