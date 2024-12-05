import React, { useState, useEffect } from "react";
import "./DocSign.css";

const ContractPage = () => {
  // State management
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [contractContent, setContractContent] = useState("");
  const [status, setStatus] = useState("");
  const [contracts, setContracts] = useState([]);

  // Fetch contracts for the client on page load
  useEffect(() => {
    fetchContracts();
  }, []);

  // Send a contract for signature
  const sendContract = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/send-contract/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clientEmail, name: clientName, contractContent }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Contract sent! Envelope ID: ${data.envelopeId}`);
        fetchContracts(); // Refresh contracts list
      } else {
        alert("Failed to send contract.");
      }
    } catch (error) {
      console.error("Error sending contract:", error);
    }
  };

  // Fetch the contract status
  const getContractStatus = async (envelopeId) => {
    try {
      const response = await fetch(`/api/contracts/status/${envelopeId}`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
      } else {
        alert("Failed to fetch contract status.");
      }
    } catch (error) {
      console.error("Error fetching contract status:", error);
    }
  };

  // Fetch all contracts
  const fetchContracts = async () => {
    try {
      const response = await fetch("/api/contracts/");
      if (response.ok) {
        const data = await response.json();
        setContracts(data.contracts);
      } else {
        alert("Failed to fetch contracts.");
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  return (
    <div className="contract-page">
      <h1>Contract Management</h1>

      {/* Send Contract Section */}
      <div className="send-contract">
        <h2>Send Contract</h2>
        <input
          type="text"
          placeholder="Client Email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Client Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <textarea
          placeholder="Contract Content"
          value={contractContent}
          onChange={(e) => setContractContent(e.target.value)}
        />
        <button onClick={sendContract}>Send Contract</button>
      </div>

      {/* View Contract Status Section */}
      <div className="contract-status">
        <h2>Check Contract Status</h2>
        <input
          type="text"
          placeholder="Envelope ID"
          onBlur={(e) => getContractStatus(e.target.value)}
        />
        {status && <p>Status: {status}</p>}
      </div>

      {/* List Contracts Section */}
      <div className="contract-list">
        <h2>All Contracts</h2>
        <ul>
          {contracts.map((contract) => (
            <li key={contract.envelopeId}>
              <p>Client: {contract.clientName}</p>
              <p>Email: {contract.clientEmail}</p>
              <p>Status: {contract.status}</p>
              <p>Envelope ID: {contract.envelopeId}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContractPage;