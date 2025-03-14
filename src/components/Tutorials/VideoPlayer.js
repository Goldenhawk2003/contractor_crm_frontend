import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VideoPlayer.css";
import Fuse from "fuse.js";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure state from location
  const {
    mediaUrl,          // Full Cloudinary URL for video or image
    title,
    description,
    contractor,
    videoId,
    tags,
    createdAt,
    isImage,
    thumbnailUrl,      // Full Cloudinary URL for thumbnail (if any)
  } = location.state || {};

  const [selectedTag, setSelectedTag] = useState("All");
  const [suggestions, setSuggestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [tutorials, setTutorials] = useState([]);

  // Helper: Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch suggestions based on current video's tags
  useEffect(() => {
    if (!videoId || !tags || tags.length === 0) return;

    axios
      .get(`${BASE_URL}/api/tutorials/`, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
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
                  tutorialTags = [];
                }
              } else {
                tutorialTags = [tutorialTags];
              }
            }
            return tutorialTags.some((tag) =>
              tags.some((vTag) => vTag.toLowerCase() === tag.toLowerCase())
            );
          })
          .slice(0, 4);
        setSuggestions(filteredSuggestions);
      })
      .catch((error) => console.error("Error fetching tutorials:", error));
  }, [videoId, tags]);

  const handleServiceClick = (service) => {
    navigate("/tutorials", { state: { selectedTag: service } });
  };

  // Handle suggestion click: use full Cloudinary URLs
  const handleSuggestionClick = (suggestion) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const fileExtension = suggestion.video_url
      ? suggestion.video_url.split(".").pop().toLowerCase()
      : "";
    const isImageSuggestion = imageExtensions.includes(fileExtension);

    navigate("/video-player", {
      state: {
        mediaUrl: suggestion.video_url,
        thumbnailUrl: suggestion.thumbnail_url,
        isImage: isImageSuggestion,
        title: suggestion.title,
        description: suggestion.description,
        contractor: suggestion.uploaded_by || "Unknown",
        createdAt: suggestion.created_at,
        videoId: suggestion.id,
        tags: Array.isArray(suggestion.tags)
          ? suggestion.tags
          : JSON.parse(suggestion.tags || "[]"),
      },
    });
  };

  const sendtext = () => {
    if (!contractor) {
      console.error("Contractor username is missing!");
      return;
    }
    navigate(`/start-conversation?username=${encodeURIComponent(contractor)}`);
  };

  // Fuse.js for search functionality
  const fuse = new Fuse(tutorials, {
    keys: ["title", "description", "contractor"],
    threshold: 0.3,
  });

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchText(value);
    if (value.length > 1) {
      const results = fuse.search(value);
      setSearchResults(results.map((result) => result.item));
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectResult = (tutorial) => {
    navigate("/video-player", {
      state: {
        mediaUrl: tutorial.video_url,
        thumbnailUrl: tutorial.thumbnail_url,
        title: tutorial.title,
        description: tutorial.description,
        contractor: tutorial.uploaded_by || "Unknown",
        createdAt: tutorial.created_at,
        videoId: tutorial.id,
        tags: Array.isArray(tutorial.tags)
          ? tutorial.tags
          : JSON.parse(tutorial.tags || "[]"),
      },
    });
    setSearchText("");
    setSearchResults([]);
  };

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
    : "Unknown Date";

  useEffect(() => {
    document.body.classList.add("video-player-page");
    return () => document.body.classList.remove("video-player-page");
  }, []);

  const services = ["All", "Interior", "Renovation", "Washroom", "Roofing", "Tiles", "Woodwork"];

  console.log("Media URL:", mediaUrl);
  console.log("Is Image?", isImage);

  if (!mediaUrl) {
    return <h2 className="error-message">No video found!</h2>;
  }

  return (
    <div className="video-player-container">
      {/* Search Bar */}
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
                  src={tutorial.thumbnail_url || "https://via.placeholder.com/80"}
                  alt={tutorial.title}
                  className="search-thumbnail"
                />
                <div>
                  <strong>{tutorial.title}</strong>
                  <p className="search-desc">
                    {tutorial.uploaded_by} | {tutorial.description.substring(0, 50)}...
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

      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Video & Info Section */}
      <div className="video-content">
        <div className="video-wrapper">
          {isImage ? (
            <img src={mediaUrl} alt={title} className="tutorial-image-display" />
          ) : (
            <video controls autoPlay className="video-player">
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div className="video-info">
          <h2 className="video-title">{title}</h2>
          <div className="date">
            <p className="video-date">{formattedDate}</p>
          </div>
          <p className="contractor-info">
            Contractor: <strong>{contractor || "Unknown"}</strong>
          </p>
          <p className="video-description">{description}</p>
          <button type="button" onClick={sendtext} className="submit-btn">
            Contact {contractor}
          </button>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="suggest-container">
        <h3 className="suggest-title">Picked for You:</h3>
        <div className="suggestions">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="suggestion-card"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <img
                  src={suggestion.thumbnail_url || "https://via.placeholder.com/150"}
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