import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Conversation = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/?conversation=${conversationId}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [conversationId]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await axios.post("/api/messages/", {
          conversation: conversationId,
          content: newMessage,
        });
        setMessages((prev) => [...prev, response.data]);
        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  return (
    <div>
      <h1>Conversation</h1>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.sender_name}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Conversation;