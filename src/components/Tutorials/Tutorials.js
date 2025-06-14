import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TutorialList.css"; // Import CSS file
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Fuse from 'fuse.js';

// Use the backend URL from an environment variable
const BASE_URL = process.env.REACT_APP_BACKEND_URL;



const TutorialList = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const navigate = useNavigate();
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTutorial, setSelectedTutorial] = useState(null); // Track selected tutorial (image/video)
  const [likes, setLikes] = useState({}); // Track likes for each tutorial
  const [selectedTag, setSelectedTag] = useState("All");
  const location = useLocation();
  const { isAuthenticated, authLoaded, user, logout } = useAuth();

  const mediaUrl = location.state?.videoUrl; // This should hold the correct media URL
  const isImage = location.state?.isImage || false;
  
  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),  // Only add if token exists
        };
  
        const response = await axios.get(`${BASE_URL}/api/tutorials/`, { headers });
        setTutorials(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tutorials:", error);
        setError(error.message);
        setLoading(false);
      }
    };
  
    fetchTutorials();
  }, []);

  const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  try {
    return JSON.parse(tags);
  } catch (error) {
    return [tags];
  }
};


const allTags = [
  "All",
  ...Array.from(
    new Set(
      tutorials
        .flatMap(tut => Array.isArray(tut.tags) ? tut.tags : normalizeTags(tut.tags))
        .filter(Boolean)
    )
  )
];

  // Initialize Fuse.js with the tutorials data
  const fuse = new Fuse(tutorials, {
    keys: ["title", "description", "contractor"],
    threshold: 0.3,
  });

  const handleOpenTutorial = (tutorial) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const isImageTutorial = tutorial.image_url && !tutorial.video_url;
    
    const tags = Array.isArray(tutorial.tags)
      ? tutorial.tags
      : normalizeTags(tutorial.tags);
  
      navigate("/video-player", {
        state: {
          mediaUrl: isImageTutorial ? tutorial.image_url : tutorial.video_url,
          isImage: isImageTutorial,
          title: tutorial.title,
          description: tutorial.description,
          contractor: tutorial.uploaded_by || "Unknown",
          createdAt: tutorial.created_at,
          videoId: tutorial.id,
          tags: Array.isArray(tutorial.tags) ? tutorial.tags : normalizeTags(tutorial.tags),
          thumbnailUrl: tutorial.thumbnail_url,
        },
      });
  };

  const handleUpload = () => {
    navigate("/upload");
  };

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
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const isImageTutorial = tutorial.image_url && !tutorial.video_url;
    
    const tags = Array.isArray(tutorial.tags)
      ? tutorial.tags
      : normalizeTags(tutorial.tags);
  
      navigate("/video-player", {
        state: {
          mediaUrl: isImageTutorial ? tutorial.image_url : tutorial.video_url,
          isImage: isImageTutorial,
          title: tutorial.title,
          description: tutorial.description,
          contractor: tutorial.uploaded_by || "Unknown",
          createdAt: tutorial.created_at,
          videoId: tutorial.id,
          tags: Array.isArray(tutorial.tags) ? tutorial.tags : normalizeTags(tutorial.tags),
          thumbnailUrl: tutorial.thumbnail_url,
        },
      });
    setSearchText("");
    setSearchResults([]);
  };



  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchText.trim()) {
      navigate('/find-contractor', { state: { query: searchText.trim() } });
    }
  };

  useEffect(() => {
    if (location.state?.selectedTag) {
      setSelectedTag(location.state.selectedTag);
    }
  }, [location.state]);

  const handleSearchButtonClick = () => {
    if (searchText.trim()) {
      navigate('/find-contractor', { state: { query: searchText.trim() } });
    }
  };

const handleServiceClick = (tag) => {
  setSelectedTag(tag);
  navigate("/tutorials", { replace: true, state: { selectedTag: tag } });
};

  const filteredTutorials = selectedTag === "All"
    ? tutorials
    : tutorials.filter((tutorial) => {
        const tags = Array.isArray(tutorial.tags)
          ? tutorial.tags
          : normalizeTags(tutorial.tags);
        return tags.includes(selectedTag);
      });
useEffect(() => {
    // Add a class to the body for this specific page
    document.body.classList.add("specific-page-tutorials");

    // Clean up by removing the class when the component is unmounted
    return () => {
      document.body.classList.remove("specific-page-tutorials");
    };
  }, []);
  return (
   
    <div className="tutorial-container">
      <div className="tutorial-header">
        <h1 className="tutorial-heading">Get Inspired</h1>
        <div className="tutorial-intro-container">
          <p className="tutorial-intro">
          Explore the skill and precision behind every project by our <span className="highlight-tutorials">Exclusive Contractors</span> proudly crafted in your community.</p>
        </div>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-bar-tutorial"
            placeholder="Search tutorials..."
            value={searchText}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
          />
          <button
            className="search-button-tutorial"
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
                    src={tutorial.thumbnail_url || "/images/IMG_2583.PNG"}
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
      </div>

      <div className="tags">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleServiceClick(tag)}
            className={`tag ${selectedTag === tag ? "active" : ""}`}
          >
            {tag}
          </button>
        ))}
     {isAuthenticated && (
  <button className="upload-button-gate" onClick={handleUpload}>
    Upload
  </button>
)}
      </div>

      {loading && <p className="tutorial-message">Loading tutorials...</p>}
      {error && <p className="tutorial-message">Account detected please sign in</p>}
      {!loading && !error && tutorials.length === 0 && (
        <p className="tutorial-message">No tutorials uploaded yet.</p>
      )}

      {/* Grid for tutorials */}
      <div className="tutorial-grid">
        {filteredTutorials.map((tutorial) => (
          <div key={tutorial.id} className="tutorial-card">
            <img
  src={tutorial.thumbnail_url || tutorial.image_url  || "/images/IMG_2583.PNG"}
  alt="Tutorial Preview"
              className="tutorial-thumbnail"
              onClick={() => handleOpenTutorial(tutorial)}
              onError={(e) => console.error("Image failed to load:", e.target.src)}
            />
           
          </div>
        ))}
      </div>

      {/* Modal for Videos */}
      {selectedTutorial && !isImage && (
        <div className="tutorial-display-card">
          <video controls autoPlay={false} className="tutorial-video">
            <source src={selectedTutorial.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="tutorial-info">
            <h3 className="tutorial-title">{selectedTutorial.title}</h3>
            <div className="tutorial-meta">
              <span>{selectedTutorial.date}</span>
              <span>{selectedTutorial.location}</span>
              <span>{selectedTutorial.duration}</span>
            </div>
            <p className="tutorial-description">{selectedTutorial.description}</p>
            <button className="message-contractor">
              Message {selectedTutorial.contractor}
            </button>
          </div>
        </div>
      )}

      {/* Modal for Images */}
      {selectedTutorial && isImage && (
        <div className="image-modal">
          <div className="image-wrapper">
            <img src={selectedTutorial.video} alt="Tutorial Image" className="image-display" />
          </div>
          <div className="image-info-box">
            <h3 className="image-title">{selectedTutorial.title}</h3>
            <p className="image-description">{selectedTutorial.description}</p>
            <button className="close-button" onClick={() => setSelectedTutorial(null)}>
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  
  );
};

export default TutorialList;