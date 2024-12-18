import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

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

  // Fetch preselected recipient details
  useEffect(() => {
    if (preselectedUsername) {
      const fetchRecipient = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/users/username/${preselectedUsername}/`,
            { credentials: "include" }
          );
          if (!response.ok) throw new Error("Recipient not found.");
          const recipient = await response.json();
          setSelectedRecipient(recipient);
          setRecipientId(recipient.id); // Use recipient ID for API requests
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
        `http://localhost:8000/api/users/search/?q=${searchTerm}`,
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
      const response = await fetch("http://localhost:8000/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          recipient_id: recipientId, // Send recipient_id
          content: message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create conversation.");
      }

      const data = await response.json();
      setSuccess("Conversation created successfully!");
      console.log("Conversation created:", data);

      // Reset state
      setMessage("");
      setRecipientId(null);
      setSelectedRecipient(null);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      setError("Could not create a conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecipientSelect = (user) => {
    setRecipientId(user.id); // Set recipient ID
    setSelectedRecipient(user);
    setError(""); // Clear any previous error
  };

  const clearPreselectedRecipient = () => {
    setRecipientId(null);
    setSelectedRecipient(null);
    setSearchResults([]);
    setSearchTerm("");
    setError(""); // Clear any previous error
  };

  return (
    <div>
      <h1>Create a New Conversation</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <label htmlFor="user-search">Search for a Recipient:</label>
      <div>
        {recipientId && selectedRecipient ? (
          <div style={{ marginBottom: "10px" }}>
            <p>
              Selected Recipient: <strong>{selectedRecipient.username}</strong>
            </p>
            <button onClick={clearPreselectedRecipient}>Clear Selection</button>
          </div>
        ) : (
          <>
            <input
              id="user-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter a name..."
              disabled={!!preselectedUsername}
            />
            <button onClick={handleSearch} disabled={searching || !!preselectedUsername}>
              {searching ? "Searching..." : "Search"}
            </button>
          </>
        )}
      </div>

      {searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          {searchResults.map((user) => (
            <div
              key={user.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "5px 0",
                cursor: "pointer",
                backgroundColor: recipientId === user.id ? "#f0f8ff" : "white",
              }}
              onClick={() => handleRecipientSelect(user)}
            >
              {user.username}
            </div>
          ))}
        </div>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message..."
        style={{ width: "100%", height: "100px", margin: "10px 0" }}
      />

      <button onClick={createConversation} disabled={loading || !recipientId}>
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default CreateConversation;