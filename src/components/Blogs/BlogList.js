import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BlogList.css"; // Import CSS for styling

// Use the backend URL from an environment variable
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from localStorage (if available)
    const token = localStorage.getItem("access_token");

    // Set up headers, including Authorization if a token exists
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    axios
      .get(`${BASE_URL}/api/blogs/`, { headers })
      .then((response) => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setError("Failed to fetch blogs. Try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="blog-container">
      <h2 className="blog-heading">Latest Blog Posts</h2>
      <button className="btn btn-primary" onClick={() => navigate("/upload-blog")}>
        Add New Blog
      </button>

      {loading && <p className="blog-message">Loading blogs...</p>}
      {error && <p className="blog-message">{error}</p>}

      <div className="blog-grid">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="blog-card"
            onClick={() => navigate(`/blogs/${blog.id}`)}
          >
            {blog.image ? (
              <img src={blog.image} alt={blog.title} className="blog-thumbnail" />
            ) : (
              <div className="placeholder-image">No Image</div>
            )}
            <h3 className="blog-title">{blog.title}</h3>
            <p className="blog-author">By {blog.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;