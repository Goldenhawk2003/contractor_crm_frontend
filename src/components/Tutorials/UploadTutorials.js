import React, { useState } from "react";
import "./UploadTutorials.css"; // Import the CSS file

const UploadTutorial = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e, type) => {
    if (type === "video") {
      setVideo(e.target.files[0]);
    } else if (type === "thumbnail") {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !video) {
      setMessage("Please fill out all fields and upload the video.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", video);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    setUploading(true);

    try {
      const response = await fetch("http://localhost:8000/api/tutorials/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Tutorial uploaded successfully!");
        setTitle("");
        setDescription("");
        setVideo(null);
        setThumbnail(null);
      } else {
        setMessage("Upload failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }

    setUploading(false);
  };

  return (
    <div className="upload-container">
      <h2 className="upload-heading">Upload a Tutorial</h2>

      {message && (
        <p className={`upload-message ${message.includes("failed") ? "error-message" : "success-message"}`}>
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
          <label className="upload-label">Description</label>
          <textarea
            className="upload-textarea"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Video Upload */}
        <div>
          <label className="upload-label">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            className="upload-file"
            onChange={(e) => handleFileChange(e, "video")}
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
            onChange={(e) => handleFileChange(e, "thumbnail")}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="upload-button" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default UploadTutorial;