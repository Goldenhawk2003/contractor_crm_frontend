import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./UserProfile.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "/Users/ammarogeil/Documents/GitHub/contractor_crm_frontend/src/context/AuthContext.js";

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
    const [activeTab, setActiveTab] = useState("home");
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
    const [showFullContent, setShowFullContent] = useState(false);
    const maxLength = 100; // Adjust to your desired length for truncation.
    const { user } = useAuth();
    const username = user?.username;
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [message, setMessage] = useState("");
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [rating, setRating] = useState(0); // Track user rating input
    const [hoveredRating, setHoveredRating] = useState(0); 

    const [sending, setSending] = useState(false);
  
    // Fetch conversations
    useEffect(() => {
      const fetchConversations = async () => {
        setLoadingConversations(true);
        try {
          const response = await axios.get("http://localhost:8000/api/conversations/", {
            withCredentials: true,
          });
          setConversations(response.data);
        } catch (err) {
          setError("Failed to load conversations.");
        } finally {
          setLoadingConversations(false);
        }
      };
      fetchConversations();
    }, []);
  
    // Fetch messages for selected conversation
    useEffect(() => {
      if (selectedConversationId) {
        setLoadingMessages(true);
        setError("");
        const fetchMessages = async () => {
          try {
            const response = await axios.get(
              `http://localhost:8000/api/conversations/${selectedConversationId}/messages/`,
              { withCredentials: true }
            );
            setMessages(response.data);
          } catch (err) {
            setError("Failed to load messages.");
          } finally {
            setLoadingMessages(false);
          }
        };
        fetchMessages();
      }
    }, [selectedConversationId]);


    const renderStars = (ratingValue) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <span
            key={i}
            className={`star ${i <= (hoveredRating || ratingValue) ? "filled" : ""}`}
            onClick={() => setRating(i)}
            onMouseEnter={() => setHoveredRating(i)}
            onMouseLeave={() => setHoveredRating(0)}
          >
            ★
          </span>
        );
      }
      return stars;
    };
  
    const handleReply = async () => {
      if (!message.trim()) {
        setError("Message cannot be empty.");
        return;
      }
  
      setSending(true);
      try {
        const csrfToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1];
  
        if (!csrfToken) {
          throw new Error("CSRF token is missing.");
        }
  
        const response = await axios.post(
          `http://localhost:8000/api/conversations/${selectedConversationId}/reply/`,
          { content: message },
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
            withCredentials: true,
          }
        );
  
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: response.data.id,
            content: message,
            sender_name: username,
            timestamp: new Date().toISOString(),
          },
        ]);
        setMessage("");
      } catch (err) {
        setError("Failed to send the message.");
      } finally {
        setSending(false);
      }
    };

    const toggleShowMore = () => {
        setShowFullContent(!showFullContent);
    };




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
    
        const EditProfile = () => {
        if(userInfo.type === "client"){
            navigate("/clients/edit/:id");

        }else{
            navigate("/contractors/edit/:id");
        
        
        }
    };


  const renderContent = () => {
    if (activeTab === "home") {
      return  <div className="tab-content">
        <img src="" alt="" className="profile-header" />
      {userInfo ? (
          <div>
             {userInfo?.logo && (
        <img
          src={userInfo.logo.startsWith("http") ? userInfo.logo : `http://localhost:8000${userInfo.logo}`}
          alt="User Logo"
          className="profile-image"
        />
      )}
            <div className="profile-info">
            
              <button className="submit-btn" onClick={EditProfile} >Edit Profile</button>
              </div>
              <div className="profile-container">
              <p className="profile-username">{userInfo.username}</p>
              {userInfo.type === "professional" && (
                <>
              <p className="profile-blue">{userInfo.type}</p>
              <p className="profile-blue">{userInfo.location}</p>
              <p>{renderStars(userInfo.rating)}</p>
              </>
    )}
              </div>
              <div className="profile-description">
                <p>{userInfo.description}</p>
                </div>
          </div>

      ) : (
          <p>Loading information...</p>
      )}
  </div>;
    }
    if (activeTab === "contracts") {
      return <div className="tab-content">
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
                                                         <div>
                                                        <p><strong>Content:</strong> 
                                                            {showFullContent
                                                                ? contract.content
                                                                : contract.content.slice(0, maxLength) +
                                                                (contract.content.length > maxLength ? "..." : "")}
                                                        </p>
                                                        {contract.content.length > maxLength && (
                                                            <button onClick={toggleShowMore} className="show-more-button">
                                                                {showFullContent ? "Show Less" : "Show More"}
                                                            </button>
                                                        )}
                                                    </div>
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
                      </div>;
    }
    if (activeTab === "payments") {
      return <div>Payments Content</div>;
    }
    if (activeTab === "chats") {
      
        if (isMobile) {
            navigate("/inbox");
        } else {
            return     <div className="chat-container-3">
            <div className="chat-sidebar-3">
              <h2 className="sidebar-header-3">Inbox</h2>
              {loadingConversations ? (
                <p>Loading...</p>
              ) : (
                <ul className="conversation-list-3">
                  {conversations.map((conversation) => (
                    <li
                      key={conversation.id}
                      className={`conversation-item-3 ${
                        conversation.id === selectedConversationId ? "active" : ""
                      }`}
                      onClick={() => setSelectedConversationId(conversation.id)}
                    >
                      {userInfo.type === "professional" ? (
                      <strong>{conversation.participants[0]}</strong>
                      ) : <strong>{conversation.participants[1]}</strong>}
                      <p>{conversation.latest_message || "No messages yet."}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="chat-main-3">
              {loadingMessages ? (
                <p>Loading messages...</p>
              ) : selectedConversationId ? (
                <>
                  <div className="messages-container-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`message ${
                          msg.sender_name === username ? "sent" : "received"
                        }`}
                      >
                        <p className="sender">{msg.sender_name}</p>
                        <p className="content-3">{msg.content}</p>
                        <p className="timestamp">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="reply-section">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your reply..."
                    />
                    <button onClick={handleReply} disabled={sending}>
                      {sending ? "Sending..." : "Reply"}
                    </button>
                  </div>
                </>
              ) : (
                <p>Select a conversation to view messages.</p>
              )}
            </div>
          </div>
        }
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
      <div className="sidebar">
        <div className="logo">
        <img
                src={`/images/EC_Primary_White.png`}
                alt="Logo"
                className="nav-logo"
                height="50px"
              />
        </div>
        <div className="menu">
          <Link
            to="#"
            className={`menu-item ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <i className="fa fa-home"></i> Home
          </Link>
          <Link
            to="#"
            className={`menu-item ${activeTab === "chats" ? "active" : ""}`}
            onClick={() => setActiveTab("chats")}
          >
            <i className="fa fa-comments"></i> Chats
          </Link>
          <Link
            to="#"
            className={`menu-item ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            <i className="fa fa-credit-card"></i> Payments
          </Link>
          <Link
            to="#"
            className={`menu-item ${activeTab === "contracts" ? "active" : ""}`}
            onClick={() => setActiveTab("contracts")}
          >
            <i className="fa fa-file-contract"></i> Contracts
          </Link>
        </div>
      </div>
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default UserProfile;