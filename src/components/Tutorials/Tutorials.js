import React, { useEffect, useState } from "react";
import "./TutorialList.css"; // Import CSS file
import { useNavigate } from 'react-router-dom';

const BASE_URL = "http://localhost:8000"; // Django Backend URL


const TutorialList = () => {
    const Navigate = useNavigate();
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null); // Track selected video
  const [likes, setLikes] = useState({}); // Track likes for each video

  useEffect(() => {
    fetch(`${BASE_URL}/api/tutorials/`)
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        setTutorials(data);
        setLoading(false);
        const initialLikes = data.reduce((acc, tutorial) => {
          acc[tutorial.id] = 0; // Placeholder for likes (default 0)
          return acc;
        }, {});
        setLikes(initialLikes);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Handle like button
  const handleLike = (id) => {
    fetch(`http://localhost:8000/api/tutorials/${id}/like/`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setLikes((prevLikes) => ({
          ...prevLikes,
          [id]: data.likes, // Update like count from API response
        }));
      })
      .catch((error) => console.error("Error liking tutorial:", error));
  };

  const handleOpenVideo = (tutorial) => {
    setSelectedVideo(tutorial);
    
    // Send view request when video is opened
    fetch(`http://localhost:8000/api/tutorials/${tutorial.id}/view/`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("View recorded:", data.views);
      })
      .catch((error) => console.error("Error recording view:", error));
  };

  const handleupload = async () => {
    Navigate('/upload')
  }

  return (

    <div className="tutorial-container">
        <button onClick={handleupload}>upload videos</button>
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
              onClick={() => setSelectedVideo(tutorial)}
              onError={(e) => console.error("Image failed to load:", e.target.src)}
            />
            <h3 className="tutorial-title">{tutorial.title}</h3>
          </div>
        ))}
      </div>

      {/* TikTok-Style Video Player (Modal) */}
      {selectedVideo && (
        <div className="video-modal">
          <div className="video-content">
            <video controls autoPlay className="video-player">
              <source src={selectedVideo.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Sidebar with Likes & Views */}
            <div className="video-sidebar">
              <p className="view-count">👀 {Math.floor(Math.random() * 1000)} views</p>
              <button className="icon-button" onClick={() => handleLike(selectedVideo.id)}>
                ❤️ {likes[selectedVideo.id]}
              </button>
            </div>

            {/* Close Button */}
            <button className="close-button" onClick={() => setSelectedVideo(null)}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialList;