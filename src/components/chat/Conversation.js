import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Conversation.css";
import { useAuth } from "/Users/ammarogeil/Documents/GitHub/contractor_crm_frontend/src/context/AuthContext.js";

const Conversation = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const { user } = useAuth(); // Extract the logged-in user's details
  const username = user?.username;
  console.log(username);


  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/conversations/${conversationId}/messages/`,
          { withCredentials: true }
        );
        setMessages(response.data);
      } catch (err) {
        setError("Please Log in to view this page.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
      // Add a class to the body for this specific page
      document.body.classList.add("specific");
  
      // Clean up by removing the class when the component is unmounted
      return () => {
        document.body.classList.remove("specific");
      };
    }, []);
  
   

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleReply(); // Submit form on Enter key press
    }
};

  const handleReply = async () => {
    if (!message.trim()) {
      setError("Message content cannot be empty.");
      return;
    
    
    }
    if (message.includes('@') || message.includes('gmail') || message.includes('yahoo') || message.includes('hotmail'))
      {
        setError("Message content cannot contain email references.");
        return;}

    setSending(true);
    setError("");

    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];

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
      setError("Failed to send reply. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <p>Loading conversation...</p>;
  }

  if (error) {
    return <p style={{ color: "red", textAlign:"center", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)" }}>{error}</p>;
  }

  return (
    <div className="container">
      <h1 className="title">Conversation</h1>
      <div className="messagesContainer">
        
        {messages.map((msg) => (
         <div
         className={`messageBubble ${
           msg.sender_name === username ? "messageBubbleRight" : "messageBubbleLeft"
         }`}
       >
         <p className="messageSender">{msg.sender_name}</p>
         <p className="messageContent">{msg.content}</p>
         <p className="messageTimestamp">
           {new Date(msg.timestamp).toLocaleDateString("en-US", {
             weekday: "short",
             month: "long",
             day: "numeric",
           })}{" "}
           at{" "}
           {new Date(msg.timestamp).toLocaleTimeString("en-US", {
             hour: "2-digit",
             minute: "2-digit",
             hour12: true,
           })}
         </p>
       </div>
        ))}
      </div>
      <div className="replySection">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your reply..."
          rows="4"
          className="textarea"
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleReply}
          disabled={sending}
          className="button"
      
        >
          {sending ? "Sending..." : "Reply"}
        </button>
      </div>
    </div>
  );
};

export default Conversation;