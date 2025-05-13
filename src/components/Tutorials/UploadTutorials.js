import React, { useState, useEffect } from "react";
import "./UploadTutorials.css";
import axios from "axios";

const UploadTutorial = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreviewURL, setThumbnailPreviewURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const services = ["Interior", "Renovation", "Washroom", "Roofing", "Tiles", "Woodwork"];

  // Handle File Upload
  const handleFileChange = (file) => {
    console.log("File selected:", file);
    setFile(file);
    const url = URL.createObjectURL(file);
    console.log("Preview URL created:", url);
    setPreviewURL(url);
  };

  const handleInputChange = (e) => {
    console.log("Input change event fired");
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  // Handle thumbnail selection and preview
  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const thumbFile = e.target.files[0];
      setThumbnail(thumbFile);
      const thumbPreview = URL.createObjectURL(thumbFile);
      setThumbnailPreviewURL(thumbPreview);
    }
  };

  // Handle tag selection
  const handleTagClick = (service) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(service)
        ? prevTags.filter((tag) => tag !== service)
        : [...prevTags, service]
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
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/tutorials/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      console.log("✅ Server Response:", response.data);
      if (response.status === 201) {
        setMessage("Tutorial uploaded successfully!");
        setTitle("");
        setDescription("");
        setFile(null);
        setThumbnail(null);
        setPreviewURL(null);
        setThumbnailPreviewURL(null);
        setSelectedTags([]);
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
    document.body.classList.add("specific-page-upload");
    return () => {
      document.body.classList.remove("specific-page-upload");
    };
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      console.log("File dropped:", e.dataTransfer.files[0]);
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="upload-tutorial">
      <div className="upload-container">
        <h2 className="upload-heading">Upload A Photo/Video</h2>
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
          <div>
            <h1 className="upload-head">To ETN Photo Gallery</h1>
            <label className="upload-label">Title</label>
            <input
              type="text"
              className="upload-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
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
          
          {/* Drag-and-Drop Zone for File Upload */}
          <div
            className={`drag-drop-zone ${isDragActive ? "drag-active" : ""}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p className="drag-drop-text">
              <strong>Choose a file</strong> or <strong>drag and drop</strong> it here
            </p>
            <p className="drag-drop-recommendation">
              We recommend using high-quality <strong>.jpg</strong> files less than <strong>20 MB</strong> or <strong>.mp4</strong> files less than <strong>200 MB</strong>.
            </p>
            <input
              type="file"
              accept="video/*, image/*"
              className="upload-file"
              onChange={handleInputChange}
              required={!file}
            />
            {file && (
              <p className="file-info">
                Selected: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            {previewURL && (
              <div className="preview-container">
                {file?.type.startsWith("image/") ? (
                  <img src={previewURL} alt="Preview" className="preview-media" />
                ) : file?.type.startsWith("video/") ? (
                  <video src={previewURL} controls className="preview-media" />
                ) : null}
              </div>
            )}
          </div>

          {/* Thumbnail Upload Section with Preview */}
          <div>
            <label className="upload-label">Upload Thumbnail (Optional)</label>
            <input
              type="file"
              accept="image/*"
              className="upload-file"
              onChange={handleThumbnailChange}
            />
            {thumbnailPreviewURL && (
              <div className="preview-container">
                <img src={thumbnailPreviewURL} alt="Thumbnail Preview" className="preview-media" />
              </div>
            )}
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