import React, { useState } from "react";
import "./DocSign.css";

const getCSRFToken = () => {
  const name = "csrftoken";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  console.error("CSRF token not found");
  return null;
};

const ContractPage = () => {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleConsent = async () => {
    setIsSubmitting(true);
    try {
      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        throw new Error("CSRF token not found");
      }

      const response = await fetch("http://localhost:8000/api/sign-contract/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, // Include CSRF token in the header
        },
        credentials: "include", // Ensures cookies are sent with the request
        body: JSON.stringify({
          consent: true,
          userId: 1, // Replace with the actual user ID from context/auth
          contractId: 101, // Replace with the actual contract ID
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Contract signed successfully.");
      } else {
        setMessage(data.error || "Failed to sign the contract.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 className="sign-header">Review and Sign Contract</h1>

      <div style={{ border: "1px solid #ccc", padding: "20px", background: "#f9f9f9" }}>
        <h2 className="sign-header2">Contract Terms</h2>
        <p className="sign-p">
          By agreeing to this contract, you consent to the following terms:
          <ol className="sign-ol">
            <li>You will provide services as per the agreed schedule.</li>
            <li>Payments must be made within 30 days of invoice submission.</li>
            <li>Failure to comply may result in termination of the agreement.</li>
          </ol>
        </p>
        <p>If you agree to these terms, please check the box below and click "Sign Contract."</p>
      </div>

      <label className="sign-label">
        <input
          type="checkbox"
          checked={agreed}
          onChange={() => setAgreed(!agreed)}
          className="sign-input"
        />
        I have read and agree to the terms of this contract.
      </label>
      <br />
      <button
        onClick={handleConsent}
        disabled={!agreed || isSubmitting}
        className="sign-button"
      >
        {isSubmitting ? "Submitting..." : "Sign Contract"}
      </button>

      {message && (
        <p
          style={{
            marginTop: "20px",
            color: message.includes("success") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ContractPage;