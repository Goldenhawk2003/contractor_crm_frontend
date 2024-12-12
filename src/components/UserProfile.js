import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";

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

axios.defaults.headers.common["X-CSRFToken"] = getCSRFToken();

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [sentContracts, setSentContracts] = useState([]);
    const [receivedContracts, setReceivedContracts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedContract, setSelectedContract] = useState("");
    const [selectedClient, setSelectedClient] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/user-info/", { withCredentials: true })
            .then((response) => setUserInfo(response.data))
            .catch((error) => {
                console.error("Failed to fetch user info:", error);
                setError("Failed to load user information. Please try again later.");
            });
    }, []);

    useEffect(() => {
        if (userInfo?.type === "professional") {
            axios
                .get("http://localhost:8000/api/contracts/", { withCredentials: true })
                .then((response) => setContracts(response.data))
                .catch((error) => {
                    console.error("Failed to fetch contracts:", error);
                    setError("Failed to load contracts. Please try again later.");
                });
        }
    }, [userInfo]);

    useEffect(() => {
        if (userInfo?.type === "professional") {
            axios
                .get("http://localhost:8000/api/sent-contracts/", { withCredentials: true })
                .then((response) => setSentContracts(response.data))
                .catch((error) => {
                    console.error("Failed to fetch sent contracts:", error);
                    setError("Failed to load sent contracts. Please try again later.");
                });
        } else if (userInfo?.type === "client") {
            axios
                .get("http://localhost:8000/api/received-contracts/", { withCredentials: true })
                .then((response) => setReceivedContracts(response.data))
                .catch((error) => {
                    console.error("Failed to fetch received contracts:", error);
                    setError("Failed to load received contracts. Please try again later.");
                });
        }
    }, [userInfo]);

    const handleSendContract = async () => {
        if (!selectedContract || !selectedClient) {
            alert("Please select a contract and provide a valid client username.");
            return;
        }
    
        const requestData = { contractId: selectedContract, clientUsername: selectedClient };
        console.log("Request Data:", requestData); // Debugging
    
        try {
            const response = await axios.post(
                "http://localhost:8000/api/send-contract/",
                requestData,
                { withCredentials: true }
            );
            alert(response.data.message);
        } catch (error) {
            console.error("Error sending contract:", error.response?.data || error.message);
            alert("Failed to send contract. Please try again.");
        }
    };

    const handleSignContract = async (contractId) => {
        try {
            const response = await axios.post(
                "http://localhost:8000/api/sign-contract/",
                { contractId },
                { withCredentials: true }
            );
            alert(response.data.message);
        } catch (error) {
            console.error("Error signing contract:", error.response?.data || error.message);
            alert(
                error.response?.data?.error || "Failed to sign contract. Please try again later."
            );
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!userInfo) {
        return <p className="loading-message">Loading user info...</p>;
    }

    return (
        <div className="user-profile">
            <div className="profile-card">
                <h1>User Profile</h1>
                <div className="profile-info">
                    <p><strong>Username:</strong> {userInfo.username || "N/A"}</p>
                    <p><strong>Email:</strong> {userInfo.email || "N/A"}</p>
                    <p><strong>Name:</strong> {userInfo.first_name || "N/A"} {userInfo.last_name || ""}</p>
                    <p><strong>Type:</strong> {userInfo.type || "N/A"}</p>
                </div>
            </div>

            {userInfo.type === "professional" && (
                <div className="contractor-section">
                    <h2>Send a Contract</h2>
                    <select onChange={(e) => setSelectedContract(e.target.value)}>
                        <option value="">Select a contract</option>
                        {contracts.map((contract) => (
                            <option key={contract.id} value={contract.id}>
                                {contract.title}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Enter client username"
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                    />
                    <button onClick={handleSendContract}>Send Contract</button>

                    <h2>Sent Contracts</h2>
                    {sentContracts.length > 0 ? (
                        <ul>
                            {sentContracts.map((contract) => (
                                <li key={contract.id}>
                                    Sent to: {contract.client_name} <br />
                                    Contract: {contract.contract_title} <br />
                                    Sent At: {new Date(contract.sent_at).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No contracts sent yet.</p>
                    )}
                </div>
            )}

            {userInfo.type === "client" && (
                <div className="client-section">
                    <h2>Received Contracts</h2>
                    {receivedContracts.length > 0 ? (
                        <ul>
                            {receivedContracts.map((contract) => (
                                <li key={contract.id}>
                                    From: {contract.contractor_name} <br />
                                    Contract: {contract.contract_title} <br />
                                    Terms: {contract.contract_terms} <br />
                                    {contract.is_signed ? (
                                        <p>Signed on {new Date(contract.signed_at).toLocaleString()}</p>
                                    ) : (
                                        <button onClick={() => handleSignContract(contract.id)}>
                                            Sign Contract
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No contracts received yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfile;