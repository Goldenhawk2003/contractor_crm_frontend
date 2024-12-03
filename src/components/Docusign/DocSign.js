import React, { useState } from "react";
import axios from "axios";

const DocusignIntegration = () => {
  const [documentPath, setDocumentPath] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [signerName, setSignerName] = useState("");
  const [envelopeId, setEnvelopeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to redirect to DocuSign login
  const connectDocusign = () => {
    window.location.href = "/docusign/login/"; // Redirects to the backend login route
  };

  // Function to send a contract
  const sendContract = async () => {
    if (!documentPath || !signerEmail || !signerName) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("/docusign/send/", {
        document_path: documentPath,
        signer_email: signerEmail,
        signer_name: signerName,
      });
      setEnvelopeId(response.data.envelopeId);
      console.log("Contract sent! Envelope ID:", response.data.envelopeId);
    } catch (error) {
      console.error("Error sending contract:", error);
      setErrorMessage("Failed to send the contract. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>DocuSign Integration</h2>
      <button
        onClick={connectDocusign}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          backgroundColor: "#5c7b78",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Connect to DocuSign
      </button>

      <div style={{ marginBottom: "20px" }}>
        <label>
          <strong>Document Path:</strong>
        </label>
        <input
          type="text"
          placeholder="/path/to/contract.pdf"
          value={documentPath}
          onChange={(e) => setDocumentPath(e.target.value)}
          style={{ display: "block", width: "100%", padding: "10px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>
          <strong>Signer Email:</strong>
        </label>
        <input
          type="email"
          placeholder="client@example.com"
          value={signerEmail}
          onChange={(e) => setSignerEmail(e.target.value)}
          style={{ display: "block", width: "100%", padding: "10px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>
          <strong>Signer Name:</strong>
        </label>
        <input
          type="text"
          placeholder="John Doe"
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
          style={{ display: "block", width: "100%", padding: "10px", marginTop: "5px" }}
        />
      </div>

      {errorMessage && (
        <p style={{ color: "red", marginBottom: "20px" }}>{errorMessage}</p>
      )}

      <button
        onClick={sendContract}
        style={{
          padding: "10px 20px",
          backgroundColor: "#dcbf79",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Sending Contract..." : "Send Contract"}
      </button>

      {envelopeId && (
        <div style={{ marginTop: "20px", color: "#1b3656" }}>
          <strong>Contract Sent!</strong>
          <p>Envelope ID: {envelopeId}</p>
        </div>
      )}
    </div>
  );
};

export default DocusignIntegration;