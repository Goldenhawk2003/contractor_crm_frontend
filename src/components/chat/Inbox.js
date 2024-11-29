import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get("/api/conversations/");
        setConversations(response.data);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  const openConversation = (conversationId) => {
    navigate(`/conversation/${conversationId}`);
  };

  return (
    <div>
      <h1>Your Inbox</h1>
      <ul>
        {conversations.map((conv) => (
          <li key={conv.id} onClick={() => openConversation(conv.id)}>
            <strong>Conversation with {conv.contractor || conv.client}</strong>
            <p>Last message: {conv.messages[conv.messages.length - 1]?.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inbox;