import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TutorialList.css"; // Import CSS file
import { useLocation, useNavigate } from "react-router-dom";
import Fuse from 'fuse.js';

// Use the backend URL from an environment variable
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

  const mediaUrl = location.state?.videoUrl; // This should hold the correct media URL
  const isImage = location.state?.isImage || false;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/tutorials/`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      })
      .then((response) => {
        setTutorials(response.data);
        setLoading(false);

        // Fetch like counts for all tutorials
        const fetchLikes = async () => {
          let likesData = {};
          for (let tutorial of response.data) {
            try {
              const likeResponse = await axios.get(`${BASE_URL}/api/tutorials/${tutorial.id}/like/`, {
                headers: {
                  "Content-Type": "application/json",
                  ...getAuthHeaders(),
                },
              });
              likesData[tutorial.id] = likeResponse.data.likes; // Store real like count
            } catch (error) {
              console.error("Error fetching like count:", error);
              likesData[tutorial.id] = 0; // Default to 0 if error occurs
            }
          }
          setLikes(likesData);
        };

        fetchLikes();
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Handle like button click
  const handleLike = async (id) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/tutorials/${id}/like/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      setLikes((prevLikes) => ({
        ...prevLikes,
        [id]: response.data.likes, // Ensure it updates correctly
      }));
    } catch (error) {
      console.error("Error liking tutorial:", error);
    }
  };

  const services = [
    "All",
    "Interior",
    "Renovation",
    "Washroom",
    "Roofing",
    "Tiles",
    "Woodwork",
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
    const fileExtension = tutorial.video ? tutorial.video.split(".").pop().toLowerCase() : "";
    const isImageTutorial = imageExtensions.includes(fileExtension);
    
    // Use full URL: if it doesn't start with http, prepend BASE_URL
    const fullMediaUrl = tutorial.video?.startsWith("http")
      ? tutorial.video
      : `${BASE_URL}${tutorial.video}`;

    console.log("📤 Navigating with Media URL:", fullMediaUrl, "📸 Is Image?", isImageTutorial);
    navigate("/video-player", {
      state: {
        mediaUrl: tutorial.video_url,
        isImage: isImageTutorial,
        title: tutorial.title,
        description: tutorial.description,
        contractor: tutorial.uploaded_by || "Unknown",
        createdAt: tutorial.created_at,
        videoId: tutorial.id,
        tags: Array.isArray(tutorial.tags) ? tutorial.tags : JSON.parse(tutorial.tags || "[]"),
      },
    });
    setSearchText("");
    setSearchResults([]);
  };

  const normalizeTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
      return JSON.parse(tags);
    } catch (error) {
      return [tags];
    }
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

  const handleServiceClick = (service) => {
    setSelectedTag(service);
    navigate("/tutorials", { replace: true, state: { selectedTag: service } });
  };

  const filteredTutorials = selectedTag === "All"
    ? tutorials
    : tutorials.filter((tutorial) => {
        const tags = Array.isArray(tutorial.tags)
          ? tutorial.tags
          : normalizeTags(tutorial.tags);
        return tags.includes(selectedTag);
      });

  return (
    <div className="tutorial-container">
      <div className="tutorial-header">
        <h1 className="tutorial-heading">Get Inspired</h1>
        <div className="tutorial-intro-container">
          <p className="tutorial-intro">
            Check our Elite Contractor's work from the community 
          </p>
        </div>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search tutorials..."
            value={searchText}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
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
        {services.map((service) => (
          <button
            key={service}
            onClick={() => handleServiceClick(service)}
            className={`tag ${selectedTag === service ? "active" : ""}`}
          >
            {service}
          </button>
        ))}
        <button className="upload-button-gate" onClick={handleUpload}>
          Upload
        </button>
      </div>

      {loading && <p className="tutorial-message">Loading tutorials...</p>}
      {error && <p className="tutorial-message">{error}</p>}
      {!loading && !error && tutorials.length === 0 && (
        <p className="tutorial-message">No tutorials uploaded yet.</p>
      )}

      {/* Grid for tutorials */}
      <div className="tutorial-grid">
        {filteredTutorials.map((tutorial) => (
          <div key={tutorial.id} className="tutorial-card">
            <img
  src={tutorial.thumbnail_url || tutorial.image_url || tutorial.video_url || "https://via.placeholder.com/150"}
  alt="Tutorial Preview"
              className="tutorial-thumbnail"
              onClick={() => handleOpenTutorial(tutorial)}
              onError={(e) => console.error("Image failed to load:", e.target.src)}
            />
            <h3 className="tutorial-title">{tutorial.title}</h3>
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