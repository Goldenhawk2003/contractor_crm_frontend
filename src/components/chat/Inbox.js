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
        const response = await fetch("http://localhost:8000/api/conversations/", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const data = await response.json();
        console.log("Conversations fetched:", data); // Debugging log
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setError("Could not load conversations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleConversationClick = (conversationId) => {
    navigate(`/conversation/${conversationId}`);
  };

  return (
    <div className="inbox-container">
      <div className="header">
        <h1 className="inbox-header">Your Inbox</h1>
        <button
          className="create-message-btn"
          onClick={() => navigate("/start-conversation")}
        >
          Create New Message
        </button>
      </div>

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
              Message From: {conversation.participants[0]}
            </strong>
            <p className="latest-message">
              Last message: {conversation.latest_message || "No messages yet."}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inbox;