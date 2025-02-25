import React, { useState } from "react";
import "./UploadTutorials.css"; // Import the CSS file

const UploadTutorial = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTags, setSelectedTags] = useState([]); // ✅ FIXED: Use an array for multiple tags

  const services = ["Interior", "Renovation", "Washroom", "Roofing", "Tiles", "Woodwork"];

  // Handle File Upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ✅ FIXED: Handle tag selection (toggle selection)
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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", file);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    formData.append("tags", JSON.stringify(selectedTags)); // ✅ FIXED: Send tags as JSON

    console.log("Form Data:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    setUploading(true);

    try {
      const response = await fetch("http://localhost:8000/api/tutorials/", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      console.log("Server Response:", responseData);

      if (response.ok) {
        setMessage("Tutorial uploaded successfully!");
        setTitle("");
        setDescription("");
        setFile(null);
        setThumbnail(null);
        setSelectedTags([]); // ✅ Reset tags after successful upload
      } else {
        setMessage("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
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
          <label className="upload-label">Caption</label>
          <textarea
            className={`upload-textarea ${description.includes("@") || /gmail|yahoo|hotmail/.test(description) ? "error-border" : ""}`}
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
          <input type="file" accept="video/*, image/*" className="upload-file" onChange={handleFileChange} required />
        </div>

        {/* Thumbnail Upload (Optional) */}
        <div>
          <label className="upload-label">Upload Thumbnail (Optional)</label>
          <input type="file" accept="image/*" className="upload-file" onChange={(e) => setThumbnail(e.target.files[0])} />
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
  );
};

export default UploadTutorial;