import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Conversation = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(""); // New message content
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false); // State for sending reply

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log(`Fetching messages for conversation ID: ${conversationId}`);
        const response = await axios.get(
          `http://localhost:8000/api/conversations/${conversationId}/messages/`,
          {
            withCredentials: true,
          }
        );

        console.log("API Response:", response.data);
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err.response || err.message);
        setError("Failed to load the conversation. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  const handleReply = async () => {
    if (!message.trim()) {
      setError("Message content cannot be empty.");
      return;
    }

    setSending(true);
    setError(""); // Clear previous errors

    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1]; // Retrieve CSRF token

      if (!csrfToken) {
        throw new Error("CSRF token is missing. Please refresh the page.");
      }

      const response = await axios.post(
        `http://localhost:8000/api/conversations/${conversationId}/reply/`,
        { content: message },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );

      console.log("Reply sent successfully:", response.data);

      // Refresh messages after sending the reply
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: response.data.id,
          content: message,
          sender_name: "You", // Replace with actual sender name if available
          timestamp: new Date().toISOString(),
        },
      ]);
      setMessage(""); // Clear input field
    } catch (err) {
      console.error("Failed to send reply:", err.response || err.message);
      setError("Failed to send reply. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <p>Loading conversation...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>Conversation</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {messages.map((msg) => (
          <li
            key={msg.id}
            style={{
              marginBottom: "15px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "10px",
            }}
          >
            <p>
              <strong>{msg.sender_name}</strong>: {msg.content}
            </p>
            <p style={{ fontSize: "0.8rem", color: "#888" }}>
              {new Date(msg.timestamp).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      {/* Reply Section */}
      <div style={{ marginTop: "20px" }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your reply..."
          rows="4"
          style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
        />
        <button
          onClick={handleReply}
          disabled={sending}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: sending ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: sending ? "not-allowed" : "pointer",
          }}
        >
          {sending ? "Sending..." : "Reply"}
        </button>
      </div>
    </div>
  );
};

export default Conversation;