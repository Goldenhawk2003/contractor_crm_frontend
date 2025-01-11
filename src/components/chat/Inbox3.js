import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Inbox3.css";
import { useAuth } from "/Users/ammarogeil/Documents/GitHub/contractor_crm_frontend/src/context/AuthContext.js";

const Chat1 = () => {
  const { user } = useAuth();
  const username = user?.username;
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [message, setMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoadingConversations(true);
      try {
        const response = await axios.get("http://localhost:8000/api/conversations/", {
          withCredentials: true,
        });
        setConversations(response.data);
      } catch (err) {
        setError("Failed to load conversations.");
      } finally {
        setLoadingConversations(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedConversationId) {
      setLoadingMessages(true);
      setError("");
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/conversations/${selectedConversationId}/messages/`,
            { withCredentials: true }
          );
          setMessages(response.data);
        } catch (err) {
          setError("Failed to load messages.");
        } finally {
          setLoadingMessages(false);
        }
      };
      fetchMessages();
    }
  }, [selectedConversationId]);

  const handleReply = async () => {
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    setSending(true);
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];

      if (!csrfToken) {
        throw new Error("CSRF token is missing.");
      }

      const response = await axios.post(
        `http://localhost:8000/api/conversations/${selectedConversationId}/reply/`,
        { content: message },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: response.data.id,
          content: message,
          sender_name: username,
          timestamp: new Date().toISOString(),
        },
      ]);
      setMessage("");
    } catch (err) {
      setError("Failed to send the message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h2 className="sidebar-header">Inbox</h2>
        {loadingConversations ? (
          <p>Loading...</p>
        ) : (
          <ul className="conversation-list">
            {conversations.map((conversation) => (
              <li
                key={conversation.id}
                className={`conversation-item ${
                  conversation.id === selectedConversationId ? "active" : ""
                }`}
                onClick={() => setSelectedConversationId(conversation.id)}
              >
                <strong>{conversation.participants.join(", ")}</strong>
                <p>{conversation.latest_message || "No messages yet."}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="chat-main">
        {loadingMessages ? (
          <p>Loading messages...</p>
        ) : selectedConversationId ? (
          <>
            <div className="messages-container">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${
                    msg.sender_name === username ? "sent" : "received"
                  }`}
                >
                  <p className="sender">{msg.sender_name}</p>
                  <p className="content">{msg.content}</p>
                  <p className="timestamp">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="reply-section">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your reply..."
              />
              <button onClick={handleReply} disabled={sending}>
                {sending ? "Sending..." : "Reply"}
              </button>
            </div>
          </>
        ) : (
          <p>Select a conversation to view messages.</p>
        )}
      </div>
    </div>
  );
};

export default Chat1;