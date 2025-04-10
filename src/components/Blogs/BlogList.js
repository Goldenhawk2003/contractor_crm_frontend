import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BlogList.css"; // Import CSS for styling
import Fuse from 'fuse.js';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/blogs/`);
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to fetch blogs. Try again later.");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Initialize Fuse.js for search functionality
  const fuse = new Fuse(blogs, {
    keys: ["title", "content", "author"],
    threshold: 0.3,
  });

  // Handle search input
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

  // Handle search result click
  const handleSelectResult = (blog) => {
    navigate(`/blogs/${blog.id}`);
    setSearchText("");
    setSearchResults([]);
  };

  // Handle Enter key press in search input
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchText.trim()) {
      navigate('/find-contractor', { state: { query: searchText.trim() } });
    }
  };

   useEffect(() => {
        // Add a class to the body for this specific page
        document.body.classList.add("specific-page-blogs");
    
        // Clean up by removing the class when the component is unmounted
        return () => {
          document.body.classList.remove("specific-page-blogs");
        };
      }, []);

  return (
    <div className="blog-container">
      <h2 className="blog-heading">Latest Blog Posts</h2>
      
      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar-tutorial"
          placeholder="Search blogs..."
          value={searchText}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
        <button
          className="search-button-tutorial"
          onClick={() => searchText && handleSelectResult(searchResults[0])}
          aria-label="Search"
          disabled={!searchText.trim()}
        >
          <i className="fas fa-search search-icon"></i>
        </button>

        {searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map((blog) => (
              <div
                key={blog.id}
                className="search-result-item"
                onClick={() => handleSelectResult(blog)}
              >
                <img
                  src={blog.image || "/images/placeholder.png"}
                  alt={blog.title}
                  className="search-thumbnail"
                />
                <div>
                  <strong>{blog.title}</strong>
                  <p className="search-desc">
                    {blog.author} | {blog.content.substring(0, 50)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

  
    

      {/* Loading and Error Handling */}
      {loading && <p className="blog-message">Loading blogs...</p>}
      {error && <p className="blog-message">{error}</p>}

      {/* Blog Grid */}
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