import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BlogDetail.css"; // Ensure CSS file exists

const BASE_URL = "http://localhost:8000"; // Change if needed

const BlogDetail = () => {
  const { pk } = useParams(); // Fetch the `pk` parameter from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [replies, setReplies] = useState([]);

  // 🔹 Fetch the blog details
  useEffect(() => {

    console.log("Blog ID (pk) from URL:", pk);
    if (!pk) {
      setError("Invalid blog ID.");
      setLoading(false);
      return;
    }
  
    axios
      .get(`${BASE_URL}/api/blogs/${pk}/`) // Use `pk` instead of slug
      .then((response) => {
        setBlog(response.data);
        setReplies(response.data.replies || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog:", error);
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
        { withCredentials: true }
      );

      setReplies([...replies, response.data]); // Append new reply
      setComment(""); // Clear input field
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post reply.");
    }

  };

  if (loading) return <p className="blog-message">Loading blog...</p>;
  if (error) return <p className="blog-message error">{error}</p>;
  console.log("Image URL:", blog.image);
  return (
    <div className="blog-detail-container">
      <h2 className="blog-title">{blog.title}</h2>
      <p className="blog-author">By {blog.author}</p>

      {/* Handle missing images properly */}
      {blog.image ? (
       <img src={blog.image} alt={blog.title} className="blog-image" onError={(e) => console.error("Image failed to load:", e.target.src)} />
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
              <li key={index} className="comment-item">{reply.content}</li>
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