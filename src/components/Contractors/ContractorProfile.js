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
  const navigate = useNavigate();
  const [contractor, setContractor] = useState(null);
  const [rating, setRating] = useState(0); // Track user rating input
  const [hoveredRating, setHoveredRating] = useState(0); // Track hovered stars
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    navigate(`/start-conversation?username=${contractor.username}`);
  };

  return (
    <div className="contractor-profile">
      {contractor.logo && (
        <div className="profile-logo">
          <img
            src={logoUrl}
            alt="Contractor Logo"
            
          />
        </div>
      )}
      <h2>{contractor.username || contractor.name}</h2>
      <p><strong>Location:</strong> {contractor.location || "N/A"}</p>
      <p><strong>Job Type:</strong> {contractor.job_type}</p>
      <p><strong>Experience:</strong> {contractor.experience_years} years</p>
      <p><strong>Rating:</strong> {renderStars(contractor.rating)}</p>
      <p ><strong className='hourly-rate'>Rate:</strong> ${contractor.hourly_rate}</p>
      <p><strong>Description:</strong> {contractor.profile_description || "No description provided"}</p>
      <div className='chat'>
        <button onClick={handleChatNow} className="submit-rating-btn">Chat with {contractor.username} now</button>
      </div>

      <div className="rating-section">
        <h3>Rate this Contractor</h3>
        <div className="stars">{renderStars(rating)}</div>
        <button onClick={handleRateContractor} className="submit-rating-btn">
          Submit Rating
        </button>
      </div>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default ContractorProfile;