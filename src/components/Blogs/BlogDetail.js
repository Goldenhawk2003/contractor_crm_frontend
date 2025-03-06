import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BlogDetail.css"; // Ensure CSS file exists

// Use the environment variable for the backend URL
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const BlogDetail = () => {
  const { pk } = useParams(); // Fetch the `pk` parameter from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [replies, setReplies] = useState([]);

  // Helper function to get the token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 🔹 Fetch the blog details
  useEffect(() => {
    console.log("Blog ID (pk) from URL:", pk);
    if (!pk) {
      setError("Invalid blog ID.");
      setLoading(false);
      return;
    }
    
    axios
      .get(`${BASE_URL}/api/blogs/${pk}/`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      })
      .then((response) => {
        setBlog(response.data);
        setReplies(response.data.replies || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog. Try again later.");
        setLoading(false);
      });
  }, [pk]);

  // 🔹 Submit a reply to the blog post
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/blogs/${pk}/reply/`, // Ensure this API endpoint exists
        { content: comment },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeaders(),
          },
        }
      );

      setReplies([...replies, response.data]); // Append new reply
      setComment(""); // Clear input field
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post reply.");
    }
  };

  if (loading) return <p className="blog-message">Loading blog...</p>;
  if (error) return <p className="blog-message error">{error}</p>;
  
  return (
    <div className="blog-detail-container">
      <h2 className="blog-title">{blog.title}</h2>
      <p className="blog-author">By {blog.author}</p>

      {/* Handle missing images properly */}
      {blog.image ? (
        <img
          src={blog.image}
          alt={blog.title}
          className="blog-image"
          onError={(e) =>
            console.error("Image failed to load:", e.target.src)
          }
        />
      ) : (
        <p className="no-image">No image available</p>
      )}

      <p className="blog-content">{blog.content}</p>

      {/* 🔹 Replies Section */}
      <div className="comments-section">
        <h3>Replies</h3>
        {replies.length === 0 ? (
          <p>No replies yet.</p>
        ) : (
          <ul className="comment-list">
            {replies.map((reply, index) => (
              <li key={index} className="comment-item">
                {reply.content}
              </li>
            ))}
          </ul>
        )}

        {/* 🔹 Comment Form */}
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a reply..."
            rows="3"
            required
          />
          <button type="submit">Post Reply</button>
        </form>
      </div>
    </div>
  );
};

export default BlogDetail;