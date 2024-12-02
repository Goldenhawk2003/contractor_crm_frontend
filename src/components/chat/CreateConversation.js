import React, { useState, useEffect } from "react";

const CreateConversation = () => {
  const [contractors, setContractors] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // New: Success message
  const [loading, setLoading] = useState(false); // New: Loading state

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/contractors/");
        const data = await response.json();
        console.log("Contractors fetched:", data); // Log API response
        setContractors(data);
      } catch (error) {
        console.error("Failed to fetch contractors:", error);
        setError("Failed to load contractors. Please try again later.");
      }
    };

    fetchContractors();
  }, []);

  const createConversation = async () => {
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages
    setLoading(true); // Set loading state

    if (!recipientId) {
      setError("Please select a contractor.");
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
      setRecipientId(""); // Reset dropdown
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

      <label htmlFor="contractor-select">Select a Contractor:</label>
      <select
        id="contractor-select"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
      >
        <option value="">Select a contractor</option>
        {contractors.map((contractor) => (
          <option key={contractor.id} value={contractor.id}>
            {contractor.username} {/* Use 'username' from API response */}
          </option>
        ))}
      </select>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message..."
      />

      <button onClick={createConversation} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default CreateConversation;