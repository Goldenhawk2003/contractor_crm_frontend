import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TutorialList.css"; // Import CSS file
import { useNavigate } from "react-router-dom";

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
  const [selectedTutorial, setSelectedTutorial] = useState(null); // Track selected tutorial (image/video)
  const [likes, setLikes] = useState({}); // Track likes for each tutorial
  const [isImage, setIsImage] = useState(false); // Track if selected item is an image

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

  const handleOpenTutorial = async (tutorial) => {
    setSelectedTutorial(tutorial);

    // Check if file is an image
    const isImageFile = tutorial.video.match(/\.(jpeg|jpg|png|gif)$/i);
    setIsImage(!!isImageFile);

    if (!isImageFile) {
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
    }
  };

  const handleUpload = () => {
    Navigate("/upload");
  };

  return (
    <div className="tutorial-container">
      <div className="button-container">
        <button className="upload-button-gate" onClick={handleUpload}>Upload</button>
      </div>
      <h2 className="tutorial-heading">Tutorials</h2>

      {loading && <p className="tutorial-message">Loading tutorials...</p>}
      {error && <p className="tutorial-message">{error}</p>}
      {!loading && !error && tutorials.length === 0 && (
        <p className="tutorial-message">No tutorials uploaded yet.</p>
      )}

      {/* Grid for tutorials */}
      <div className="tutorial-grid">
        {tutorials.map((tutorial) => (
          <div key={tutorial.id} className="tutorial-card">
            <img
              src={tutorial.thumbnail || tutorial.video} // Use thumbnail if available, else use the media file itself
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
        <div className="video-modal">
          <div className="video-wrapper">
            <video controls autoPlay className="video-player">
              <source src={selectedTutorial.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Sidebar: Likes, Views, Caption */}
            <div className="video-sidebar">
              <div className="video-info-box">
                <h3 className="video-title">{selectedTutorial.title}</h3>
                <p className="video-description">{selectedTutorial.description}</p>

                {/* Like Button */}
                <button className="icon-button" onClick={() => handleLike(selectedTutorial.id)}>
                  ❤️ {likes[selectedTutorial.id] !== undefined ? likes[selectedTutorial.id] : "Loading..."}
                </button>

                {/* View Count */}
                <p className="view-count">👀 {selectedTutorial.views !== undefined ? selectedTutorial.views : "Loading..."}</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button className="close-button" onClick={() => setSelectedTutorial(null)}>✖</button>
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