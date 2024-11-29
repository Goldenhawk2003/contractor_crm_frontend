import React, { useState, useEffect } from "react";
import axios from "axios";



const fetchCsrfToken = () => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (!token) {
      console.error("CSRF token not found");
      return null;
  }
  return token;
};


axios.defaults.headers.common["X-CSRFToken"] = fetchCsrfToken();

const CreateConversation = () => {
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState("");

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await axios.get("/api/contractors/");
        console.log("Fetched Contractors:", response.data); // Log data
        setContractors(response.data);
      } catch (error) {
        console.error("Failed to fetch contractors:", error);
      }
    };
  
    fetchContractors();
  }, []);

  const startConversation = async () => {
    if (selectedContractor) {
      try {
        await axios.post("/api/conversations/", { contractor: selectedContractor });
        alert("Conversation started!");
      } catch (error) {
        console.error("Failed to start conversation:", error);
      }
    }
  };

  return (
    <div>
      <h2>Start a New Conversation</h2>
      <select onChange={(e) => setSelectedContractor(e.target.value)}>
        <option value="">Select a Contractor</option>
        {contractors.map((contractor) => (
          <option key={contractor.id} value={contractor.id}>
            {contractor.username}
          </option>
        ))}
      </select>
      <button onClick={startConversation} disabled={!selectedContractor}>
        Start
      </button>
    </div>
  );
};

export default CreateConversation;