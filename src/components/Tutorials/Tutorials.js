import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TutorialList.css"; // Import CSS file
import { useLocation, useNavigate } from "react-router-dom";
import Fuse from 'fuse.js';

const BASE_URL = "https://ecc-backend-8684636373f0.herokuapp.com"; // Django Backend URL

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

// Add CSRF token to Axios requests dynamically
axios.interceptors.request.use(
  (config) => {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const TutorialList = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const Navigate = useNavigate();
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTutorial, setSelectedTutorial] = useState(null); // Track selected tutorial (image/video)
  const [likes, setLikes] = useState({}); // Track likes for each tutorial// Track if selected item is an image
  const [selectedTag, setSelectedTag] = useState("All");
  const location = useLocation();



  const mediaUrl = location.state?.videoUrl; // ✅ This should hold the correct media URL
  const isImage = location.state?.isImage || false;

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/tutorials/`)
      .then((response) => {
        setTutorials(response.data);
        setLoading(false);

        // Fetch like counts for all tutorials
        const fetchLikes = async () => {
          let likesData = {};
          for (let tutorial of response.data) {
            try {
              const likeResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tutorials/${tutorial.id}/like/`);
              likesData[tutorial.id] = likeResponse.data.likes; // Store real like count
            } catch (error) {
              console.error("Error fetching like count:", error);
              likesData[tutorial.id] = 0; // Default to 0 if error occurs
            }
          }
          setLikes(likesData);
        };

        fetchLikes(); // Call the function
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Handle like button
  const handleLike = async (id) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/tutorials/${id}/like/`,
        {},
        { withCredentials: true }
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
  const fuse = new Fuse(tutorials, {
    keys: ["title", "description", "contractor"],
    threshold: 0.3, // Allows some mistakes in the search
  });

const handleOpenTutorial = (tutorial) => {
  const BASE_URL = "https://ecc-backend-8684636373f0.herokuapp.com"; // Adjust this if needed
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

  const handleUpload = () => {
    Navigate("/upload");
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
    setSearchText(""); // Clear search text after selection
    setSearchResults([]); // Hide suggestions
  };

  const normalizeTags = (tags) => {
    if (!tags) return []; // 🔴 Handle empty tags
    if (Array.isArray(tags)) return tags; // ✅ Already an array
    try {
      return JSON.parse(tags); // 🛠 If stringified array, parse it
    } catch (error) {
      return [tags]; // 🛑 If parsing fails, wrap in an array
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchText.trim()) {
      Navigate('/find-contractor', { state: { query: searchText.trim() } });
    }
  };

  useEffect(() => {
    if (location.state?.selectedTag) {
      setSelectedTag(location.state.selectedTag);
    }
  }, [location.state]); 

  const handleSearchButtonClick = () => {
    if (searchText.trim()) {
      Navigate('/find-contractor', { state: { query: searchText.trim() } });
    }
  };
  const handleServiceClick = (service) => {
    setSelectedTag(service); // Update state
    Navigate("/tutorials", { replace: true, state: { selectedTag: service } }); // Keep state when navigating
  };


  const filteredTutorials = selectedTag === "All"
  ? tutorials
  : tutorials.filter(tutorial => tutorial.tags.includes(selectedTag));


  return (
    <div className="tutorial-container">
      <div className="tutorial-header"> 
      <h1 className="tutorial-heading">Get Inspired</h1>
      <div className="tutorial-intro-container">
      <p className="tutorial-intro">Check our Elite Contractor's work from the community </p>
      </div>
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
  
        <button className="upload-button-gate" onClick={handleUpload}>Upload</button>
      
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
        src={tutorial.thumbnail || tutorial.video}
        alt="Tutorial Preview"
        className="tutorial-thumbnail"
        onClick={() => handleOpenTutorial(tutorial)} // Open in new tab
        onError={(e) => console.error("Image failed to load:", e.target.src)}
      />
      <h3 className="tutorial-title">{tutorial.title}</h3>
    </div>
  ))}
</div>


      {/* Modal for Videos */}
      {selectedTutorial && !isImage && (
  <div className="tutorial-display-card">
    <video controls  className="tutorial-video">
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
      <button className="message-contractor">Message {selectedTutorial.contractor}</button>
    </div>
  </div>
)}

      {/* Modal for Images */}
      {selectedTutorial && isImage && (
        <div className="image-modal">
          <div className="image-wrapper">
            <img src={selectedTutorial.video} alt="Tutorial Image" className="image-display" />
          </div>

          {/* Caption and Close Button */}
          <div className="image-info-box">
            <h3 className="image-title">{selectedTutorial.title}</h3>
            <p className="image-description">{selectedTutorial.description}</p>
            <button className="close-button" onClick={() => setSelectedTutorial(null)}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialList;