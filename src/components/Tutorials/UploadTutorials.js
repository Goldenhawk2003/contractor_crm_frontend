import React, { useState, useEffect } from "react";
import "./UploadTutorials.css"; // Import the CSS file
import axios from "axios";

// Optional: Remove CSRF token function if you're using token-based auth.
// const getCSRFToken = () => {
//   const name = "csrftoken";
//   const cookies = document.cookie.split(";");
//   for (let cookie of cookies) {
//     cookie = cookie.trim();
//     if (cookie.startsWith(`${name}=`)) {
//       return cookie.substring(name.length + 1);
//     }
//   }
//   console.error("CSRF token not found");
//   return null;
// };

const UploadTutorial = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTags, setSelectedTags] = useState([]); // Use an array for multiple tags


  const services = ["Interior", "Renovation", "Washroom", "Roofing", "Tiles", "Woodwork"];

  // Handle File Upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle tag selection (toggle selection)
  const handleTagClick = (service) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(service)
        ? prevTags.filter((tag) => tag !== service) // Remove tag if already selected
        : [...prevTags, service] // Add tag if not selected
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !description || !file) {
      setMessage("Please fill out all fields and upload an image or video.");
      return;
    }
  
    const fileType = file.type;
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
  
    if (fileType.startsWith("image/")) {
      formData.append("image", file);
    } else if (fileType.startsWith("video/")) {
      formData.append("video", file);
    } else {
      setMessage("Unsupported file type. Please upload an image or video.");
      return;
    }
  
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
  
    formData.append("tags", JSON.stringify(selectedTags));
    
    setUploading(true);

    try {
      // Get the access token from localStorage
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/tutorials/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
            // If you still need CSRF protection, add:
            // "X-CSRFToken": getCSRFToken(),
          },
          // Remove withCredentials when using token-based auth
        }
      );

      console.log("✅ Server Response:", response.data);
      if (response.status === 201) {
        setMessage("Tutorial uploaded successfully!");
        setTitle("");
        setDescription("");
        setFile(null);
        setThumbnail(null);
        setSelectedTags([]); // Reset tags after successful upload
      } else {
        setMessage("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Upload Error:", error.response ? error.response.data : error);
      setMessage(`An error occurred: ${error.response?.data?.detail || "Unknown error"}`);
    }

    setUploading(false);
  };
  
  useEffect(() => {
      // Add a class to the body for this specific page
      document.body.classList.add("specific-page-upload");
  
      // Clean up by removing the class when the component is unmounted
      return () => {
        document.body.classList.remove("specific-page-upload");
      };
    }, []);

  return (
    <div className="upload-tutorial">
    <div className="upload-container">
      <h2 className="upload-heading">Upload a Tutorial</h2>

      {message && (
        <p
          className={`upload-message ${
            message.includes("failed") ? "error-message" : "success-message"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        {/* Title */}
        <div>
          <label className="upload-label">Title</label>
          <input
            type="text"
            className="upload-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="upload-label">Caption</label>
          <textarea
            className={`upload-textarea ${
              description.includes("@") || /gmail|yahoo|hotmail/.test(description)
                ? "error-border"
                : ""
            }`}
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        {/* File Upload (Video/Image) */}
        <div>
          <label className="upload-label">Upload Video or Image</label>
          <input
            type="file"
            accept="video/*, image/*"
            className="upload-file"
            onChange={handleFileChange}
            required
          />
        </div>

        {/* Thumbnail Upload (Optional) */}
        <div>
          <label className="upload-label">Upload Thumbnail (Optional)</label>
          <input
            type="file"
            accept="image/*"
            className="upload-file"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </div>

        {/* Tags Selection */}
        <div className="upload-tags">
          <label className="upload-label">Tags</label>
          <div className="upload-tag">
            {services.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => handleTagClick(service)}
                className={`upload-tag ${selectedTags.includes(service) ? "active" : ""}`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="upload-button" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
    </div>
  );
};

export default UploadTutorial;