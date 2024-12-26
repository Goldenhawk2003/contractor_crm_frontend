import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
    const [consents, setConsents] = useState([]);
    const [contracts, setContracts] = useState([]); // List of contracts for contractors
    const [sentContracts, setSentContracts] = useState([]); // Contracts sent by contractors
    const [receivedContracts, setReceivedContracts] = useState([]); // Contracts received by clients
    const [searchTerm, setSearchTerm] = useState(""); // Input for searching users
    const [searchResults, setSearchResults] = useState([]); // User search results
    const [selectedUser, setSelectedUser] = useState(null); // Selected user for sending
    const [selectedContract, setSelectedContract] = useState(""); // Selected contract ID for sending
    const [sendSuccess, setSendSuccess] = useState(""); // Success message for sending contracts
    const [sendError, setSendError] = useState(""); // Error message for sending contracts
    const [signSuccess, setSignSuccess] = useState(""); // Success message for signing contracts
    const [signError, setSignError] = useState(""); // Error message for signing contracts
    const [error, setError] = useState(null);
    const [searching, setSearching] = useState(false); // Searching state

    // Fetch user profile
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/user-info/", { withCredentials: true })
            .then((response) => setUserInfo(response.data))
            .catch(() => setError("Failed to load user information. Please try again later."));
    }, []);

    

    // Fetch contracts for contractors
    useEffect(() => {
        if (userInfo?.type === "professional") {
            axios
                .get("http://localhost:8000/api/contracts/", { withCredentials: true })
                .then((response) => setContracts(response.data))
                .catch(() => setSendError("Failed to fetch contracts."));
        }
    }, [userInfo]);

    // Fetch sent contracts for contractors
    useEffect(() => {
        if (userInfo?.type === "professional") {
            axios
                .get("http://localhost:8000/api/sent-contracts/", { withCredentials: true })
                .then((response) => setSentContracts(response.data.contracts))
                .catch(() => setSendError("Failed to fetch sent contracts."));
        }
    }, [userInfo]);

    // Fetch received contracts for clients
    useEffect(() => {
        if (userInfo?.type === "client") {
            axios
                .get("http://localhost:8000/api/received-contracts/", { withCredentials: true })
                .then((response) => setReceivedContracts(response.data.contracts))
                .catch(() => setSignError("Failed to fetch received contracts."));
        }
    }, [userInfo]);

    useEffect(() => {
        if (userInfo?.type === "professional") {
            axios
                .get("http://localhost:8000/api/sent-contracts/", { withCredentials: true })
                .then((response) => {
                    console.log("Sent Contracts Response:", response.data.contracts);
                    setSentContracts(response.data.contracts);
                })
                .catch((error) => {
                    console.error("Failed to fetch sent contracts:", error);
                    setSendError("Failed to fetch sent contracts.");
                });
        }
    }, [userInfo]);
    console.log("Initial Sent Contracts State:", sentContracts);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setSendError("Please enter a username to search.");
            return;
        }

        setSearching(true);
        setSendError("");

        try {
            const response = await axios.get(
                `http://localhost:8000/api/users/search/?q=${searchTerm}`,
                { withCredentials: true }
            );
            setSearchResults(response.data);
            if (response.data.length === 0) {
                setSendError("No users found with the provided username.");
            }
        } catch {
            setSendError("Failed to search for users. Please try again.");
        } finally {
            setSearching(false);
        }
    };

    const sendContract = async () => {
        const contract = contracts.find((c) => c.id === parseInt(selectedContract));
        if (!contract) {
            setSendError("Invalid contract selected.");
            return;
        }

        setSendError("");
        setSendSuccess("");

        try {
            const payload = {
                user_id: selectedUser.id,
                contractContent: contract.content,
            };

            await axios.post("http://localhost:8000/api/send-contract/", payload, {
                withCredentials: true,
            });

            setSendSuccess("Contract sent successfully!");
            setSelectedUser(null);
            setSelectedContract("");
        } catch {
            setSendError("Failed to send contract. Please try again.");
        }
    };

    const signContract = async (contractId) => {
        setSignError("");
        setSignSuccess("");

        try {
            await axios.post(
                "http://localhost:8000/api/sign-contract/",
                { contract_id: contractId },
                { withCredentials: true }
            );

            setSignSuccess("Contract signed successfully!");
            setReceivedContracts((prev) =>
                prev.map((contract) =>
                    contract.id === contractId ? { ...contract, is_signed: true } : contract
                )
            );
        } catch {
            setSignError("Failed to sign contract. Please try again.");
        }
    };

    if (error) return <p className="error-message">{error}</p>;
    if (!userInfo) return <p className="loading-message">Loading user info...</p>;

    const logoUrl =
        userInfo.logo && userInfo.logo.startsWith("http")
            ? userInfo.logo
            : userInfo.logo
            ? `http://localhost:8000${userInfo.logo}`
            : null;

    return (
        <div className="user-profile">
            <div className="profile-card">
                <h1>User Profile</h1>
                {logoUrl && <img src={logoUrl} alt="User Logo" />}
                <p><strong>Username:</strong> {userInfo.username}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Type:</strong> {userInfo.type}</p>
            </div>

            {userInfo.type === "professional" && (
                <div className="contract-section">
                    <h2>Send a Contract</h2>
                    {sendError && <p className="error-message">{sendError}</p>}
                    {sendSuccess && <p className="success-message">{sendSuccess}</p>}

                    <label htmlFor="user-search" className="user-label">Search for a User:</label>
                    <input
                        id="user-search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter a username..."
                        className="user-input"
                    />
                    <button onClick={handleSearch} disabled={searching} className="user-button">
                        {searching ? "Searching..." : "Search"}
                    </button>

                    <div className="search-results">
                        {searchResults.map((user) => (
                            <div
                                key={user.id}
                                className={`search-result-item ${
                                    selectedUser?.id === user.id ? "selected" : ""
                                }`}
                                onClick={() => setSelectedUser(user)}
                            >
                                {user.username}
                            </div>
                        ))}
                    </div>

                    {selectedUser && (
                        <p>
                            Selected User: <strong>{selectedUser.username}</strong>
                        </p>
                    )}

                    <label htmlFor="contract-select">Select a Contract:</label>
                    <select
                        id="contract-select"
                        value={selectedContract}
                        onChange={(e) => setSelectedContract(e.target.value)}
                        className="user-select"
                    >
                        <option value="">-- Select Contract --</option>
                        {contracts.map((contract) => (
                            <option key={contract.id} value={contract.id}>
                                {contract.title}
                            </option>
                        ))}
                    </select>

                    <button onClick={sendContract} className="user-button">Send Contract</button>

                    <h2>Sent Contracts</h2>
                    <ul className="user-ul">
                        {sentContracts.map((contract) => (
                            <li key={contract.id} className="user-li">
                                <p><strong>Title:</strong> {contract.title}</p>
                                <p><strong>Recipient:</strong> {contract.recipient}</p>
                                <p><strong>Status:</strong> {contract.is_signed ? "Signed" : "Pending"}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {userInfo.type === "client" && (
                <div className="received-contracts">
                    <h2>Received Contracts</h2>
                    {signError && <p className="error-message">{signError}</p>}
                    {signSuccess && <p className="success-message">{signSuccess}</p>}
                    <ul>
    {receivedContracts.map((contract) => (
        <li key={contract.id}>
            <p><strong>Title:</strong> {contract.title}</p>
            <p><strong>Status:</strong> {contract.is_signed ? "Signed" : "Pending"}</p>
            {contract.is_signed && (
                <>
                    <p className="signed">Contract signed!</p>
                    <p>
                        <Link to="/payment" className="user-button">
                            Pay Now
                        </Link>
                    </p>
                </>
            )}
            {!contract.is_signed && (
                <p>
                    <button
                        onClick={() => signContract(contract.id)}
                        className="user-button"
                    >
                        Sign
                    </button>
                </p>
            )}
        </li>
    ))}
</ul>
                </div>
            )}


        </div>
    );
};

export default UserProfile;