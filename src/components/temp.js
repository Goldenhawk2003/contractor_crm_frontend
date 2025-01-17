import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./UserProfile.css";
import { useNavigate } from 'react-router-dom';

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
    const [activeTab, setActiveTab] = useState("information");
    const [userInfo, setUserInfo] = useState(null);
    const [sentContracts, setSentContracts] = useState([]);
    const [receivedContracts, setReceivedContracts] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sendSuccess, setSendSuccess] = useState("");
    const [sendError, setSendError] = useState("");
    const [signSuccess, setSignSuccess] = useState("");
    const [signError, setSignError] = useState("");
    const [searching, setSearching] = useState(false);
    const [newContractTitle, setNewContractTitle] = useState("");
    const [newContractContent, setNewContractContent] = useState("");
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);



    // Fetch user profile
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/user-info/", { withCredentials: true })
            .then((response) => setUserInfo(response.data))
            .catch(() => setError("Please sign in"));
    }, []);

    // Fetch sent contracts for professionals
    useEffect(() => {
        if (userInfo?.type === "professional" && activeTab === "contracts") {
            axios
                .get("http://localhost:8000/api/sent-contracts/", { withCredentials: true })
                .then((response) => setSentContracts(response.data.contracts))
                .catch(() => setError("Failed to fetch sent contracts."));
        }
    }, [userInfo, activeTab]);

    // Fetch received contracts for clients
    useEffect(() => {
        if (userInfo?.type === "client" && activeTab === "contracts") {
            axios
                .get("http://localhost:8000/api/received-contracts/", { withCredentials: true })
                .then((response) => setReceivedContracts(response.data.contracts))
                .catch(() => setError("Failed to fetch received contracts."));
        }
    }, [userInfo, activeTab]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 950);
        handleResize(); // Check initial size
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleChat = () => {
        if (isMobile) {
            navigate("/inbox");
        } else {
            navigate("/Inbox3");
        }
    };


    const renderTabContent = () => {
        if (activeTab === "information") {
            return (
                <div className="tab-content">
                    <h2>Personal Information</h2>
                    {userInfo ? (
                        <div>
                            <p><strong>Username:</strong> {userInfo.username}</p>
                            <p><strong>Email:</strong> {userInfo.email}</p>
                            <p><strong>Type:</strong> {userInfo.type}</p>
                            <p><strong>Location:</strong> {userInfo.location}</p>
                        </div>
                    ) : (
                        <p>Loading information...</p>
                    )}
                </div>
            );
        } else if (activeTab === "contracts") {
            return (
                <div className="tab-content">
                    <h2>Your Contracts</h2>
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
        } else if (activeTab === "payments") {
            return <div className="tab-content"><h2>Your Payments</h2><p>Payment section coming soon.</p></div>;
        }
    };
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

    return (
        <div className="user-profile">
  <div className="profile-container">
    {/* Left section for profile details and tabs */}
    <div className="profile-left">
      {userInfo?.logo && (
        <img
          src={userInfo.logo.startsWith("http") ? userInfo.logo : `http://localhost:8000${userInfo.logo}`}
          alt="User Logo"
          className="profile-image"
        />
      )}
      <h2>{userInfo?.username || "Loading..."}</h2>
      <p>{userInfo?.email || "Email not available"}</p>
      <Link 
        to={userInfo?.type === "professional" 
            ? `/contractors/edit/${userInfo?.id}` 
            : `/clients/edit/${userInfo?.id}`}
        className="edit-profile-button"
      >
        Edit Profile
      </Link>
      
      {/* Vertical Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "information" ? "active" : ""}`}
          onClick={() => setActiveTab("information")}
        >
          Information
        </button>
        <button
          className={`tab ${activeTab === "contracts" ? "active" : ""}`}
          onClick={() => setActiveTab("contracts")}
        >
          Contracts
        </button>
        <button
          className={`tab ${activeTab === "payments" ? "active" : ""}`}
          onClick={() => setActiveTab("payments")}
        >
          Payments
        </button>
        <button 
          className="tab"
          onClick={handleChat}
        >
          Chat
        </button>
      </div>
    </div>

    {/* Right section for tab content */}
    <div className="profile-right">
      {renderTabContent()}
    </div>
  </div>
</div>
    );
};

export default UserProfile;