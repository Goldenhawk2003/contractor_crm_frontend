import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BlogDetail.css"; // Ensure CSS file exists

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
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/blogs/${pk}/`, {
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
      // Change Content-Type to application/json
      const response = await axios.post(
        `${BASE_URL}/api/blogs/${pk}/reply/`, // Ensure this API endpoint exists
        { content: comment },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      // Log the response for debugging
      console.log("Reply posted successfully:", response.data);

      // Append the new reply
      setReplies([...replies, response.data]);
      setComment(""); // Clear input field
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post reply.");
    }
  };
    useEffect(() => {
        // Add a class to the body for this specific page
        document.body.classList.add("specific-page-detail");
    
        // Clean up by removing the class when the component is unmounted
        return () => {
          document.body.classList.remove("specific-page-detail");
        };
      }, []);

  if (loading) return <p className="blog-message">Loading blog...</p>;
  if (error) return <p className="blog-message error">{error}</p>;
  


  return (
    <div className="blog-detail-page">
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
     
    </div>
    </div>
  );
};

export default BlogDetail;