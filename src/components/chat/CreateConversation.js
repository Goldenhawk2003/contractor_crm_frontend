import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./Inbox3.css";

const getCSRFToken = () => {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];
  if (!csrfToken) {
    console.error("CSRF token is missing. Please refresh the page.");
  }
  return csrfToken;
};

const CreateConversation = () => {
  const [searchParams] = useSearchParams();
  const preselectedUsername = searchParams.get("username");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recipientId, setRecipientId] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    if (preselectedUsername) {
      const fetchRecipient = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/username/${preselectedUsername}/`,
            { credentials: "include" }
          );
          if (!response.ok) throw new Error("Recipient not found.");
          const recipient = await response.json();
          setSelectedRecipient(recipient);
          setRecipientId(recipient.id);
        } catch (error) {
          console.error("Error fetching recipient details:", error);
          setError("Failed to load recipient details.");
        }
      };
      fetchRecipient();
    }
  }, [preselectedUsername]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a name to search.");
      return;
    }
    setSearching(true);
    setError("");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/search/?q=${searchTerm}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Failed to search for users.");
      const data = await response.json();
      setSearchResults(data);
      if (data.length === 0) {
        setError("No users found. Try a different search term.");
      }
    } catch (error) {
      console.error("Search failed:", error);
      setError("Could not perform the search. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const createConversation = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    if (!recipientId || !message.trim()) {
      setError("Please select a recipient and write a message.");
      setLoading(false);
      return;
    }
    const csrfToken = getCSRFToken();
    if (!csrfToken) {
      setError("CSRF token is missing. Please refresh the page and try again.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ recipient_id: recipientId, content: message }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create conversation.");
      }
      setSuccess("Conversation created successfully!");
      setMessage("");
      setRecipientId(null);
      setSelectedRecipient(null);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      setError("Could not create a conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container-3">
      {/* Sidebar for user search */}
      <div className="chat-sidebar-3">
        <h2 className="sidebar-header-3">Search Users</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter a name..."
          className="search-bar-3"
        />
        <button className="search-button-3" onClick={handleSearch} disabled={searching}>
          {searching ? "Searching..." : "Search"}
        </button>
        {searchResults.length > 0 && (
          <ul className="conversation-list-3">
            {searchResults.map((user) => (
              <li
                key={user.id}
                className={`conversation-item-3 ${recipientId === user.id ? "active" : ""}`}
                onClick={() => {
                  setRecipientId(user.id);
                  setSelectedRecipient(user);
                  setError("");
                }}
              >
                <strong>{user.username}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main chat section */}
      <div className="chat-main-3">
        <div className="messages-container-3">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          {selectedRecipient ? (
            <h3>Chatting with {selectedRecipient.username}</h3>
          ) : (
            <p>Select a user to start a conversation.</p>
          )}
        </div>

        {/* Message input */}
        <div className="reply-section">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
          />
         <button
            onClick={() => setShowModal(true)} // ✅ Open the confirmation modal
            disabled={loading || !recipientId}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Consent Required</h3>
            <p>Are you sure you want to send this message?</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={createConversation}>Yes, Send</button>
              <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateConversation;