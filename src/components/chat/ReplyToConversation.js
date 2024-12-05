import React, { useState } from "react";

const ReplyToConversation = ({ conversationId, onReplySent }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    setError(""); // Clear previous errors
    setLoading(true); // Set loading state

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
      const response = await fetch(`http://localhost:8000/api/conversations/${conversationId}/reply/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Try to parse error response
        throw new Error(errorData.error || "Failed to send reply.");
      }

      const data = await response.json();
      console.log("Reply sent successfully:", data);

      setMessage(""); // Clear the input field
      if (onReplySent) onReplySent(); // Callback to refresh messages or update UI
    } catch (error) {
      console.error("Failed to send reply:", error);
      setError(error.message || "Could not send reply. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your reply..."
      />
      <button onClick={handleReply} disabled={loading}>
        {loading ? "Sending..." : "Reply"}
      </button>
    </div>
  );
};

export default ReplyToConversation;