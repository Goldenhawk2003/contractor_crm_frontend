import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./DocSign.css";

// Function to retrieve CSRF token from cookies
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

// Configure Axios with CSRF token and credentials
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-CSRFToken"] = getCSRFToken();

const ContractPage = () => {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/contracts/');
        setContracts(response.data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
        setErrorMessage("Failed to load contracts. Please try again later.");
      }
    };

    fetchContracts();
  }, []);

  const handleContractSelect = (id) => {
    const contract = contracts.find((c) => c.id === id);
    setSelectedContract(contract);
    setSuccessMessage(""); // Clear any previous success message
    setErrorMessage(""); // Clear any previous error message
  };

  const handleSignContract = async () => {
    if (!selectedContract || !consentGiven) {
      alert("Please select a contract and give consent.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/sign-contract/",
        {
          contractId: selectedContract.id,
          consent: true, // Always true since consent is required to sign
        },
        { withCredentials: true }
      );

      if (response.data.message) {
        setSuccessMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error signing contract:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Failed to sign the contract. Please try again later.");
      }
    }
  };

  return (
    <div className="contract-signing">
      <h1>Review and Sign Contract</h1>

      {/* Contract Selector */}
      <select onChange={(e) => handleContractSelect(Number(e.target.value))}>
        <option value="">Select a contract</option>
        {contracts.map((contract) => (
          <option key={contract.id} value={contract.id}>
            {contract.title}
          </option>
        ))}
      </select>

      {/* Display Selected Contract */}
      {selectedContract && (
        <div className="contract-terms">
          <h2>{selectedContract.title}</h2>
          <p>{selectedContract.content}</p>
        </div>
      )}

      {/* Consent and Sign */}
      <div className="consent">
        <input
          type="checkbox"
          id="consent"
          checked={consentGiven}
          onChange={(e) => setConsentGiven(e.target.checked)}
        />
        <label htmlFor="consent">I agree to the terms of this contract</label>
      </div>
      <button onClick={handleSignContract}>Sign Contract</button>

      {/* Success Message */}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Error Message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default ContractPage;