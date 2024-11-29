import React, { useState } from "react";
import axios from "axios";

const ContractorList = ({ contractors }) => {
  const [chatRoomId, setChatRoomId] = useState(null);

  const initiateChat = async (contractorId) => {
    try {
      const response = await axios.post("/api/chat/create/", { contractor_id: contractorId });
      setChatRoomId(response.data.chat_room_id);
      alert("Chat room created!");
    } catch (error) {
      console.error(error.response?.data || "An error occurred.");
    }
  };

  return (
    <div>
      <h2>Available Contractors</h2>
      <ul>
        {contractors.map((contractor) => (
          <li key={contractor.id}>
            {contractor.name}
            <button onClick={() => initiateChat(contractor.id)}>Chat</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContractorList;