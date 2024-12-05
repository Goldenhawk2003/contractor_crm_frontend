import React, { useState } from "react";

const CreateConversation = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Input for searching users
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [recipientId, setRecipientId] = useState(""); // Selected recipient
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Success message
  const [loading, setLoading] = useState(false); // Loading state
  const [searching, setSearching] = useState(false); // Searching state

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a name to search.");
      return;
    }

    setSearching(true);
    setError(""); // Clear previous errors

    try {
      const response = await fetch(`http://localhost:8000/api/users/search/?q=${searchTerm}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to search for users. Please try again.");
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed:", error);
      setError(error.message || "Could not perform the search. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const createConversation = async () => {
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages
    setLoading(true); // Set loading state

    if (!recipientId) {
      setError("Please select a recipient.");
      setLoading(false);
      return;
    }

    if (!message.trim()) {
      setError("Message content cannot be empty.");
      setLoading(false);
      return;
    }

    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1]; // Retrieve CSRF token

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
          recipient_id: recipientId,
          content: message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Try to parse error response
        throw new Error(errorData.error || "Failed to create conversation.");
      }

      const data = await response.json();
      console.log("Conversation created successfully:", data);

      setSuccess("Conversation created successfully!");
      setMessage(""); // Clear message input
      setRecipientId(""); // Reset selected recipient
    } catch (error) {
      console.error("Failed to create conversation:", error);
      setError(error.message || "Could not create a conversation. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      <h1>Create a New Conversation</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <label htmlFor="user-search">Search for a Recipient:</label>
      <div>
        <input
          id="user-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter a name..."
        />
        <button onClick={handleSearch} disabled={searching}>
          {searching ? "Searching..." : "Search"}
        </button>
      </div>

      <div>
        <h3>Search Results:</h3>
        {searchResults.length === 0 && searchTerm && <p>No users found.</p>}
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
            onClick={() => setRecipientId(user.id)} // Set selected recipient
          >
            {user.username}
          </div>
        ))}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message..."
      />

      <button onClick={createConversation} disabled={loading || !recipientId}>
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default CreateConversation;