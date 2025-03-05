import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Inbox.css"; // Import the CSS file

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/conversations/`, {
          method: "GET",
          credentials: "include",
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
  
        const data = await response.json();
        console.log("Raw data fetched:", data); // Debugging log
  
        // Sort conversations by latest_message_time
        const sortedConversations = data.sort((a, b) => {
          const dateA = new Date(a.latest_message_timestamp);
          const dateB = new Date(b.latest_message_timestamp);
          return dateB - dateA; // Newest timestamps first
        });
        
        console.log("Sorted conversations:", sortedConversations);
        setConversations(sortedConversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setError("Please log in to view this page.");
      } finally {
        setLoading(false);
      }
      
    };
  
    fetchConversations();
  }, []);


  const handleConversationClick = (conversationId) => {
    navigate(`/conversation/${conversationId}`);
  };
  if (error) {
    return <p style={{ color: "red", textAlign:"center", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)" }}>{error}</p>;
  }
  return (
    <div className="inbox-container">
    <header className="header">
      <h1 className="inbox-header">Your Inbox</h1>
    </header>
    <div className="content">
      <div className="conversation-list-container">
        {error && <p className="error">{error}</p>}
        {loading && <p className="loading">Loading...</p>}
        {!loading && conversations.length === 0 && (
          <p className="empty">No conversations found.</p>
        )}
        <ul className="conversation-list">
          {conversations.map((conversation) => (
            <li
              key={conversation.id}
              className="conversation-item"
              onClick={() => handleConversationClick(conversation.id)}
            >
              <strong className="participants">
                {conversation.participants.join(", ")}
              </strong>
              <p className="latest-message">
                {conversation.latest_message || "No messages yet."}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="action-container">
        <button
          className="create-message-btn"
          onClick={() => navigate("/start-conversation")}
        >
          Create New Message
        </button>
      </div>
    </div>
  </div>
  );
};

export default Inbox;