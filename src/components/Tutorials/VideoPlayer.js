import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VideoPlayer.css"; // Add custom styles

const BASE_URL = "http://localhost:8000"; // Your backend URL

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoUrl = location.state?.videoUrl;
  const title = location.state?.title;
  const description = location.state?.description;
  const contractor = location.state?.contractor;
  const videoId = location.state?.videoId; // Get current video ID
  const [selectedTag, setSelectedTag] = useState("All");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Fetch related videos
    if (videoId) {
      axios.get(`${BASE_URL}/api/tutorials/related/${videoId}/`)
        .then(response => {
          setSuggestions(response.data);
        })
        .catch(error => console.error("Error fetching suggestions:", error));
    }
  }, [videoId]);

  const handleServiceClick = (service) => {
    navigate("/tutorials", { state: { selectedTag: service } });
  };

  const handleSuggestionClick = (suggestion) => {
    navigate("/video-player", {
      state: {
        videoUrl: suggestion.video,
        title: suggestion.title,
        description: suggestion.description,
        contractor: suggestion.contractor,
        videoId: suggestion.id, // Send new video ID
      },
    });
  };

  useEffect(() => {
    console.log("Current video ID:", videoId); // Debugging line
    if (videoId) {
      axios.get(`${BASE_URL}/api/tutorials/related/${videoId}/`)
        .then(response => {
          console.log("Related videos:", response.data); // Debugging line
          setSuggestions(response.data);
        })
        .catch(error => console.error("Error fetching suggestions:", error));
    }
  }, [videoId]);

  const services = ["All", "Interior", "Renovation", "Washroom", "Roofing", "Tiles", "Woodwork"];

  if (!videoUrl) {
    return <h2 className="error-message">No video found!</h2>;
  }

  return (
    <div className="video-player-container">
      {/* Tags Section */}
      <div className="tags">
        {services.map((service) => (
          <button
            key={service}
            onClick={() => handleServiceClick(service)}
            className={`tag ${selectedTag === service ? "active" : ""}`}
          >
            {service}
          </button>
        ))}
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

      {/* Video & Info Side by Side */}
      <div className="video-content">
        {/* Video Section */}
        <div className="video-wrapper">
          <video controls autoPlay className="video-player">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Info Section */}
        <div className="video-info">
          <h2 className="video-title">{title}</h2>
          <p className="video-description">{description}</p>
          <p className="contractor-info">Uploaded by: <strong>{contractor}</strong></p>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="suggest-container">
        <h3 className="suggest-title">Picked for You:</h3>
        <div className="suggestions">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div key={suggestion.id} className="suggestion-card" onClick={() => handleSuggestionClick(suggestion)}>
                <img
                  src={suggestion.thumbnail || "https://via.placeholder.com/150"}
                  alt={suggestion.title}
                  className="suggestion-thumbnail"
                />
                <h4 className="suggestion-title">{suggestion.title}</h4>
              </div>
            ))
          ) : (
            <p className="no-suggestions">No related videos found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;