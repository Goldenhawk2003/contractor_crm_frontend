import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TutorialList.css"; // Import CSS file
import { useNavigate } from 'react-router-dom';

const BASE_URL = "http://localhost:8000"; // Django Backend URL

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
    const Navigate = useNavigate();
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null); // Track selected video
  const [likes, setLikes] = useState({}); // Track likes for each video

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/tutorials/`)
      .then((response) => {
        setTutorials(response.data);
        setLoading(false);
  
        // Fetch like counts for all tutorials
        const fetchLikes = async () => {
          let likesData = {};
          for (let tutorial of response.data) {
            try {
              const likeResponse = await axios.get(`${BASE_URL}/api/tutorials/${tutorial.id}/like/`);
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
        `http://localhost:8000/api/tutorials/${id}/like/`,
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

  const handleOpenVideo = async (tutorial) => {
    setSelectedVideo(tutorial);

    setTimeout(() => {
      const modal = document.querySelector(".video-modal");
      if (modal) modal.scrollIntoView({ behavior: "smooth" });
    }, 100);
  
    // Fetch the like count when the video is opened
    try {
      const response = await axios.get(`${BASE_URL}/api/tutorials/${tutorial.id}/like/`);
      setLikes((prevLikes) => ({
        ...prevLikes,
        [tutorial.id]: response.data.likes,  // Set correct like count
      }));
    } catch (error) {
      console.error("Error fetching like count:", error);
    }
  
    // Send view request when video is opened
    try {
      const response = await axios.post(`${BASE_URL}/api/tutorials/${tutorial.id}/view/`);
      setTutorials((prevTutorials) =>
        prevTutorials.map((t) =>
          t.id === tutorial.id ? { ...t, views: response.data.views } : t
        )
      );
    } catch (error) {
      console.error("Error recording view:", error);
    }
  };

  const handleupload = async () => {
    Navigate('/upload')
  }

  return (

    <div className="tutorial-container">
      <div className="button-container">
  <button className="upload-button-gate" onClick={handleupload}>Upload</button>
</div>
      <h2 className="tutorial-heading">Tutorial Videos</h2>

      {loading && <p className="tutorial-message">Loading tutorials...</p>}
      {error && <p className="tutorial-message">{error}</p>}

      {!loading && !error && tutorials.length === 0 && (
        <p className="tutorial-message">No tutorials uploaded yet.</p>
      )}

      {/* Pinterest-Style Grid */}
      <div className="tutorial-grid">
  {tutorials.map((tutorial) => (
    <div key={tutorial.id} className="tutorial-card">
      <img
        src={tutorial.thumbnail}
        alt="Tutorial Thumbnail"
        className="tutorial-thumbnail"
        onClick={() => handleOpenVideo(tutorial)} // Call this instead of setSelectedVideo
        onError={(e) => console.error("Image failed to load:", e.target.src)}
      />
      <h3 className="tutorial-title">{tutorial.title}</h3>
    </div>
  ))}
</div>

{/* TikTok-Style Video Player (Modal) */}
{selectedVideo && (
  <div className="video-modal">
    <div className="video-wrapper"> {/* Wraps video and sidebar */}

      {/* Video Player */}
      <video controls autoPlay className="video-player">
        <source src={selectedVideo.video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Sidebar: Likes, Views, Caption */}
      <div className="video-sidebar">
        

        {/* Caption Box */}
        <div className="video-info-box">
          <h3 className="video-title">{selectedVideo.title}</h3>
          <p className="video-description">{selectedVideo.description}</p>
          {/* Like Button */}
        <button className="icon-button" onClick={() => handleLike(selectedVideo.id)}>
          ❤️ {likes[selectedVideo.id] !== undefined ? likes[selectedVideo.id] : "Loading..."}
        </button>

        {/* View Count */}
        <p className="view-count">👀 {selectedVideo.views !== undefined ? selectedVideo.views : "Loading..."}</p>
        </div>
      </div>
    </div>

    {/* Close Button */}
    <button className="close-button" onClick={() => setSelectedVideo(null)}>✖</button>
  </div>
)}
    </div>
  );
};

export default TutorialList;