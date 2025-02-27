import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ContractorProfile.css';

// Retrieve CSRF token from cookies
const getCSRFToken = () => {
  const name = "csrftoken";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  console.error("CSRF token not found");
  return null;
};

// Configure Axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-CSRFToken"] = getCSRFToken();

const ContractorProfile = () => {
  const { id } = useParams();
  const Navigate = useNavigate();
  const [contractor, setContractor] = useState(null);
  const [rating, setRating] = useState(0); // Track user rating input
  const [hoveredRating, setHoveredRating] = useState(0); // Track hovered stars
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tutorials, setTutorials] = useState([]);

  useEffect(() => {
    const fetchContractor = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/contractors/${id}/`);
        setContractor(response.data);
      } catch (error) {
        console.error('Error fetching contractor details:', error);
        setErrorMessage("Failed to load contractor details. Please try again later.");
      }
    };

    fetchContractor();
  }, [id]);

  const handleRateContractor = async () => {
    if (rating <= 0 || rating > 5) {
      alert("Please provide a rating between 1 and 5.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/contractors/${id}/rate/`,
        { rating },
        { withCredentials: true }
      );
      setSuccessMessage(response.data.message || "Rating submitted successfully.");
      setErrorMessage("");
      // Optionally, fetch the updated contractor details
      setContractor((prev) => ({
        ...prev,
        rating: response.data.updatedRating,
      }));
    } catch (error) {
      console.error('Error rating contractor:', error);
      setErrorMessage("Failed to submit rating. Please try again.");
    }
  };


  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/contractors/${id}/tutorials/`);
        console.log("Tutorials API Response:", response.data);  // 🔍 Debugging
        setTutorials(response.data);
      } catch (error) {
        console.error("Error fetching tutorials:", error);
      }
    };
  
    fetchTutorials();
  }, [id]);

  const renderStars = (ratingValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= (hoveredRating || ratingValue) ? "filled" : ""}`}
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (errorMessage) return <p className="error-message">{errorMessage}</p>;
  if (!contractor) return <p>Loading contractor details...</p>;

  const logoUrl = contractor.logo?.startsWith("http")
    ? contractor.logo
    : `http://localhost:8000${contractor.logo}`;

  const handleChatNow = () => {
    Navigate(`/start-conversation?username=${contractor.username}`);
  };

  const handleOpenTutorial = (tutorial) => {
    const BASE_URL = "http://localhost:8000"; // Adjust this if needed
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const fileExtension = tutorial.video ? tutorial.video.split(".").pop().toLowerCase() : "";
    const isImage = imageExtensions.includes(fileExtension);
    
    // ✅ Ensure full URL
    const fullMediaUrl = tutorial.video?.startsWith("http") ? tutorial.video : `${BASE_URL}${tutorial.video}`;
  
    console.log("📤 Navigating with Media URL:", fullMediaUrl, "📸 Is Image?", isImage);
    Navigate("/video-player", {
      state: {
        mediaUrl: fullMediaUrl,
        isImage,
        title: tutorial.title,
        description: tutorial.description,
        contractor: tutorial.uploaded_by || "Unknown",
        createdAt: tutorial.created_at,
        videoId: tutorial.id, // ✅ Ensure this is passed
        tags: Array.isArray(tutorial.tags) ? tutorial.tags : JSON.parse(tutorial.tags || "[]"), 
      },
    });
  };

  return (
    <div className="cont-contractor-profile">
      <div className="cont-profile-header">
        <div className="cont-profile-left">
          <img src={logoUrl} alt="Contractor Logo" className="cont-profile-img" />
        </div>

        <div className="cont-profile-right">
          <h2 className="cont-contractor-name">{contractor.username || contractor.name}</h2>
          <span className="cont-contractor-badge">Contractor</span>
          <div className="cont-location-tags">
            <span>Location: {contractor.location || "N/A"}</span>
            <span>{contractor.job_type}</span>
          </div>
          <div className="cont-rating-section">
            <span className="cont-stars">{renderStars(contractor.rating)}</span>

          </div>
          <p className="cont-contractor-bio">{contractor.profile_description || "No description provided"}</p>
        </div>
      </div>
      <div className="cont-contact-section">
        <button className="cont-send-message-btn" onClick={handleChatNow}>Send Message</button>
     
      </div>
      <div className="const-section-divider"></div>
      <div className="cont-past-work-section">
        <h3>Past Work</h3>
        <div className="const-work-gallery">
    {contractor.past_work_images?.map((img, index) => (
      <img key={index} src={img} alt="Past Work" className="past-work-img" />
    ))}
  </div>


  <div className="const-tutorials-container">
  <div className="const-tutorials-flex">
    {tutorials.map((tutorial) => (
      <div 
        key={tutorial.id} 
        className="const-tutorial-card" 
        onClick={() => handleOpenTutorial(tutorial)} // ✅ Attach Click Event
      >
     

        {/* Handle Videos & Images */}
        {tutorial.video ? (
          tutorial.video.endsWith(".mp4") || tutorial.video.endsWith(".mov") ? (
            <video className="const-tutorial-video" controls>
              <source src={tutorial.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={tutorial.video} alt="Tutorial" className="const-tutorial-image" />
          )
        ) : (
          <p>No media available</p>
        )}
      </div>
    ))}
  </div>
</div>
      </div>

   

      <div className="cont-rating-input">
        <h3>Rate this Contractor</h3>
        <div className="cont-stars">{renderStars(rating)}</div>
        <button onClick={handleRateContractor} className="cont-submit-rating-btn">Submit Rating</button>
      </div>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default ContractorProfile;