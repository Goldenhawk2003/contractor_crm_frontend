import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VideoPlayer.css"; // Add custom styles
import Fuse from 'fuse.js';

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
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const videoTags = location.state?.tags || []; 

  
  
  
  useEffect(() => {
    if (!videoId || !videoTags.length) return;
  
    console.log("🔄 Fetching new suggestions for Video ID:", videoId, "Tags:", videoTags);
  
    axios
      .get(`${BASE_URL}/api/tutorials/`)
      .then((response) => {
        const allTutorials = response.data;
  
        const filteredSuggestions = allTutorials
          .filter((tutorial) => {
            if (tutorial.id === videoId) return false; // Exclude current video
  
            let tutorialTags = tutorial.tags;
            if (typeof tutorialTags === "string") {
              if (tutorialTags.startsWith("[") && tutorialTags.endsWith("]")) {
                try {
                  tutorialTags = JSON.parse(tutorialTags);
                } catch (error) {
                  console.error("❌ Error parsing tutorial tags:", error);
                  tutorialTags = [];
                }
              } else {
                tutorialTags = [tutorialTags];
              }
            }
  
            return tutorialTags.some((tag) =>
              videoTags.some((vTag) => vTag.toLowerCase() === tag.toLowerCase())
            );
          })
          .slice(0, 4); // Limit to 4 suggestions
  
        console.log("✅ Updated Suggestions:", filteredSuggestions);
        setSuggestions(filteredSuggestions);
      })
      .catch((error) => console.error("❌ Error fetching tutorials:", error));
  }, [videoId]); // ✅ Re-run when video changes
  
  console.log("Current Video Tags:", videoTags);
  const handleServiceClick = (service) => {
    navigate("/tutorials", { state: { selectedTag: service } });
  };

  const handleSuggestionClick = (suggestion) => {
    console.log("🎯 Clicking suggestion:", suggestion);
  
    navigate("/video-player", {
      state: {
        videoUrl: suggestion.video,
        title: suggestion.title,
        description: suggestion.description,
        contractor: suggestion.contractor,
        videoId: suggestion.id,
        tags: Array.isArray(suggestion.tags) ? suggestion.tags : [suggestion.tags],
      },
    });
  
    // 🔥 Force video element to reload properly
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };


    const fuse = new Fuse(tutorials, {
    keys: ["title", "description", "contractor"],
    threshold: 0.3, // Allows some mistakes in the search
  });

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchText(value);

    if (value.length > 1) {
      const results = fuse.search(value);
      setSearchResults(results.map((result) => result.item)); // Extract actual items
    } else {
      setSearchResults([]);
    }
  };
  const handleSelectResult = (tutorial) => {
    navigate("/video-player", {
      state: {
        videoUrl: tutorial.video,
        title: tutorial.title,
        description: tutorial.description,
        contractor: tutorial.contractor,
        videoId: tutorial.id,
      },
    });
    setSearchText(""); // Clear search text after selection
    setSearchResults([]); // Hide suggestions
  };

  useEffect(() => {
    document.body.classList.add("video-player-page");
    return () => document.body.classList.remove("video-player-page"); // Cleanup when unmounting
  }, []);

  const services = ["All", "Interior", "Renovation", "Washroom", "Roofing", "Tiles", "Woodwork"];

  if (!videoUrl) {
    return <h2 className="error-message">No video found!</h2>;
  }

  return (
    <div className="video-player-container">
      

      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search tutorials..."
          value={searchText}
          onChange={handleSearch}
        />
        <button
          className="search-button"
          onClick={() => searchText && handleSelectResult(searchResults[0])}
          aria-label="Search"
          disabled={!searchText.trim()}
        >
          <i className="fas fa-search search-icon"></i>
        </button>

        {searchResults.length > 0 && (
  <div className="search-dropdown">
    {searchResults.map((tutorial) => (
      <div
        key={tutorial.id}
        className="search-result-item"
        onClick={() => handleSelectResult(tutorial)}
      >
        <img
          src={tutorial.thumbnail || "https://via.placeholder.com/80"}
          alt={tutorial.title}
          className="search-thumbnail"
        />
        <div>
          <strong>{tutorial.title}</strong>
          <p className="search-desc">
            {tutorial.contractor} | {tutorial.description.substring(0, 50)}...
          </p>
        </div>
      </div>
    ))}
  </div>
)}
</div> 
      {/* Tags Section */}
      <div className="player-tags">
        {services.map((service) => (
          <button
            key={service}
            onClick={() => handleServiceClick(service)}
            className={`player-tag ${selectedTag === service ? "active" : ""}`}
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