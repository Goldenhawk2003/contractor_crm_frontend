import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadBlog.css"; // Add styles

const UploadBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.title || !formData.content) {
      setError("Title and content are required.");
      return;
    }

    const blogData = new FormData();
    blogData.append("title", formData.title);
    blogData.append("content", formData.content);
    if (formData.image) {
      blogData.append("image", formData.image);
    }

    setUploading(true);

    try {
      // Get the access token from localStorage
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/blogs/`,
        blogData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": token ? `Bearer ${token}` : "",
          },
        }
      );

      if (response.status === 201) {
        setMessage("Blog uploaded successfully!");
        setTimeout(() => navigate("/blogs"), 2000);
      } else {
        setError("Failed to upload blog. Try again.");
      }
    } catch (err) {
      console.error("Error uploading blog:", err);
      setError("Something went wrong. Please try again.");
    }

    setUploading(false);
  };

  return (
    <div className="upload-blog-container">
      <h2>Upload a Blog</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit} className="upload-blog-form">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <label>Content:</label>
        <textarea
          name="content"
          rows="4"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <label>Image (Optional):</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Blog"}
        </button>
      </form>
    </div>
  );
};

export default UploadBlog;