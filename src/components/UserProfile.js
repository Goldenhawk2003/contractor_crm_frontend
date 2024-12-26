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
    const [sentContracts, setSentContracts] = useState([]);
    const [receivedContracts, setReceivedContracts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sendSuccess, setSendSuccess] = useState("");
    const [sendError, setSendError] = useState("");
    const [signSuccess, setSignSuccess] = useState("");
    const [signError, setSignError] = useState("");
    const [error, setError] = useState(null);
    const [searching, setSearching] = useState(false);

    // New states for creating a contract
    const [newContractTitle, setNewContractTitle] = useState("");
    const [newContractContent, setNewContractContent] = useState("");

    // Fetch user profile
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/user-info/", { withCredentials: true })
            .then((response) => setUserInfo(response.data))
            .catch(() => setError("Please sign in"));
    }, []);

    // Fetch sent contracts for professionals
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
        if (!newContractTitle || !newContractContent || !selectedUser) {
            setSendError("Please fill in all fields and select a user.");
            return;
        }

        setSendError("");
        setSendSuccess("");

        try {
            const payload = {
                user_id: selectedUser.id,
                title: newContractTitle, // Include title
                contractContent: newContractContent, // Include content
            };

            await axios.post("http://localhost:8000/api/send-contract/", payload, {
                withCredentials: true,
            });

            setSendSuccess("Contract sent successfully!");
            setSelectedUser(null);
            setNewContractTitle("");
            setNewContractContent("");
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
                <Link 
        to={userInfo?.type === "professional" 
            ? `/contractors/edit/${userInfo?.id}` 
            : `/clients/edit/${userInfo?.id}`} 
        className="user-button"
    >
        Edit Profile
    </Link>
            </div>

            {userInfo.type === "professional" && (
                <div className="contract-section">
                    <h2>Create and Send a Contract</h2>
                    {sendError && <p className="error-message">{sendError}</p>}
                    {sendSuccess && <p className="success-message">{sendSuccess}</p>}

                    {/* Search User */}
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
                        <p className="selected-user">
                            Selected User: <strong>{selectedUser.username}</strong>
                        </p>
                    )}

                    {/* Create Contract */}
                    <label>Contract Title</label>
                    <input
                        type="text"
                        value={newContractTitle}
                        onChange={(e) => setNewContractTitle(e.target.value)}
                        placeholder="Enter contract title"
                        className="user-input"
                    />
                    <label>Contract Content</label>
                    <textarea
                        value={newContractContent}
                        onChange={(e) => setNewContractContent(e.target.value)}
                        placeholder="Enter contract content"
                        className="user-input"
                        rows="5"
                    ></textarea>

                    <button onClick={sendContract} className="user-button">
                        Send Contract
                    </button>

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
                                <p><strong>Content:</strong> {contract.content}</p> {/* Added content here */}
                                <p><strong>Status:</strong> {contract.is_signed ? "Signed" : "Pending"}</p>
                                <div className="button-container">
                                {!contract.is_signed && (
                                    <button
                                        onClick={() => signContract(contract.id)}
                                        className="user-button"
                                    >
                                        Sign
                                    </button>
                                )}
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
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserProfile;