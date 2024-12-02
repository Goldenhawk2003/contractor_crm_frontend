import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateConversation = () => {
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState("");
  const [loadingContractors, setLoadingContractors] = useState(true);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [contractorError, setContractorError] = useState("");
  const [conversationError, setConversationError] = useState("");
  const navigate = useNavigate();

  // Fetch CSRF token from cookies
  const getCSRFToken = () => {
    const cookie = document.cookie.split("; ").find((row) => row.startsWith("csrftoken="));
    return cookie ? cookie.split("=")[1] : "";
  };

  useEffect(() => {
    const fetchContractors = async () => {
      setLoadingContractors(true);
      try {
        const response = await axios.get("http://localhost:8000/api/contractors/", {
          withCredentials: true, // Ensures cookies are sent
        });
        setContractors(response.data);
      } catch (err) {
        console.error("Failed to fetch contractors:", err);
        setContractorError("Failed to load contractors. Please try again later.");
      } finally {
        setLoadingContractors(false);
      }
    };

    fetchContractors();
  }, []);

  const handleCreateConversation = async () => {
    if (!selectedContractor) {
      setConversationError("Please select a contractor.");
      return;
    }

    setConversationError(""); // Clear previous errors
    setLoadingConversation(true);

    try {
      const csrfToken = getCSRFToken();
      const response = await axios.post(
        "http://localhost:8000/api/conversations/",
        { contractor_id: selectedContractor },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include session cookies
        }
      );
      navigate(`/conversation/${response.data.id}`);
    } catch (err) {
      console.error("Failed to create conversation:", err);
      setConversationError("Could not create a conversation. Please try again.");
    } finally {
      setLoadingConversation(false);
    }
  };

  return (
    <div>
      <h1>Create a New Conversation</h1>

      {contractorError && <p style={{ color: "red" }}>{contractorError}</p>}
      {conversationError && <p style={{ color: "red" }}>{conversationError}</p>}

      {loadingContractors ? (
        <p>Loading contractors...</p>
      ) : (
        <>
          <label htmlFor="contractor-select">Select a Contractor:</label>
          <select
            id="contractor-select"
            value={selectedContractor}
            onChange={(e) => setSelectedContractor(e.target.value)}
          >
            <option value="">-- Choose a Contractor --</option>
            {contractors.map((contractor) => (
              <option key={contractor.id} value={contractor.id}>
                {contractor.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleCreateConversation}
            disabled={loadingConversation}
          >
            {loadingConversation ? "Starting..." : "Start Conversation"}
          </button>
        </>
      )}
    </div>
  );
};

export default CreateConversation;