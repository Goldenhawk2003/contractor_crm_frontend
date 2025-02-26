import React, { useState, useEffect, useRef } from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div>
      {/* About Us Section */}
      <div className="about-us-container">
        <div className="text-content">
          <h1>About Us</h1>
          <h2>Leading the Way in Trust and Community</h2>
          <p>We believe what's good for the community is good for contractors.</p>
        </div>
        <img src="/images/home-page/commercial-roofing_orig.jpg" alt="About Us" />
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
        <h2>Our Story</h2>
        <div className="story-container"><p>
          We are a community-based elite contracting platform that connects local contractors with community members. We believe that what's good for the community is good for contractors. Our platform is designed to help contractors grow their businesses and provide community members with a trusted source for their contracting needs.
        </p></div>
        
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