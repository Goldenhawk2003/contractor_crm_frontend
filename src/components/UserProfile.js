import React, { useState, useEffect, useCallback,useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./UserProfile.css";
import { useAuth } from "../context/AuthContext";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ------------------- Sidebar Component -------------------
const Sidebar = ({ activeTab, unreadMessages, setActiveTab, userInfo }) => {

  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 950);
    handleResize(); // Check initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="sidebar">
      <div className="logo">
       
      <h1>Welcome Back {userInfo?.username || "..."}</h1>
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
  to={isMobile ? "/inbox" : "#"}
  className={`menu-item ${activeTab === "chats" ? "active" : ""}`}
  onClick={(e) => {
    if (!isMobile) {
      e.preventDefault(); // Prevent default navigation if not on mobile
      setActiveTab("chats");
    }
  }}
>
          <i className="fa fa-comments"></i> Chats
          {unreadMessages > 0 && (
            <span className="notification-badge">{unreadMessages}</span>
          )}
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
  );
};

// ------------------- StarRating Component -------------------
const StarRating = ({ ratingValue, onRate }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`star ${i <= (hoveredRating || ratingValue) ? "filled" : ""}`}
          onClick={() => onRate && onRate(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// ------------------- HomeTab Component -------------------
const HomeTab = ({ userInfo }) => {
  const navigate = useNavigate();

  const editProfile = useCallback(() => {
    if (userInfo?.type === "client") {
      navigate("/clients/edit/:id");
    } else {
      navigate("/contractors/edit/:id");
    }
  }, [navigate, userInfo]);

  return (
    <div className="tab-content">
      {userInfo ? (
        <div>
          {userInfo.logo && (
            <img
              src={
                userInfo.logo.startsWith("http")
                  ? userInfo.logo
                  : `${process.env.REACT_APP_BACKEND_URL}${userInfo.logo}`
              }
              alt="User Logo"
              className="profile-image"
            />
          )}
          <div className="profile-info">
            <button className="submit-btn" onClick={editProfile}>
              Edit Profile
            </button>
          </div>
          <div className="profile-container">
            <p className="profile-username">{userInfo.username}</p>
            {userInfo.type === "professional" && (
              <>
                <p className="profile-blue">{userInfo.type}</p>
                <p className="profile-blue">{userInfo.location}</p>
                <StarRating ratingValue={userInfo.rating} />
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
    </div>
  );
};

// ------------------- ProfessionalContracts Component -------------------
const ProfessionalContracts = () => {
  const [contractTab, setContractTab] = useState("create");
  const [newContractTitle, setNewContractTitle] = useState("");
  const [newContractContent, setNewContractContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sendSuccess, setSendSuccess] = useState("");
  const [sendError, setSendError] = useState("");
  const [sentContracts, setSentContracts] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setSendError("Please enter a username to search.");
      return;
    }
    setSendError("");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/search/?q=${searchTerm}`,
        { headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        }, }
      );
      setSearchResults(response.data);
      if (response.data.length === 0) {
        setSendError("No users found with the provided username.");
      }
    } catch {
      setSendError("Failed to search for users. Please try again.");
    }
  }, [searchTerm]);

  const sendContract = useCallback(async () => {
    if (!newContractTitle || !newContractContent || !selectedUser) {
      setSendError("Please fill in all fields and select a user.");
      return;
    }
  
    const startDate = document.getElementById("start-date")?.value || "Not specified";
    const endDate = document.getElementById("end-date")?.value || "Not specified";
    const price = document.getElementById("price")?.value || "Not specified";
    const cycle = document.getElementById("cycle")?.value || "Not specified";
  
    const fullContent = `
  📅 Project Dates:
  Start: ${startDate}
  End: ${endDate}
  
  💰 Pricing:
  Amount: ${price}
  Payment Cycle: ${cycle}
  
  📄 Terms:
  ${newContractContent}
    `;
  
    const payload = {
      user_id: selectedUser.id,
      title: newContractTitle,
      contractContent: fullContent.trim(),
    };
  
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/send-contract/`, payload, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      setSendSuccess("Contract sent successfully!");
      setSelectedUser(null);
      setNewContractTitle("");
      setNewContractContent("");
    } catch {
      setSendError("Failed to send contract. Please try again.");
    }
  }, [newContractTitle, newContractContent, selectedUser]);

  // Fetch sent contracts when switching to "sent" or "signed" tab
  useEffect(() => {
    if (contractTab === "sent" || contractTab === "signed") {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/sent-contracts/`, { headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        }, })
        .then((response) => setSentContracts(response.data.contracts))
        .catch(() => setError("Failed to fetch sent contracts."));
    }
  }, [contractTab]);

  return (
    <div>
      <div className="contract-tabs">
        <button
          className={`contract-tab ${contractTab === "create" ? "active" : ""}`}
          onClick={() => setContractTab("create")}
        >
          Create New Contract
        </button>
        <button
          className={`contract-tab ${contractTab === "sent" ? "active" : ""}`}
          onClick={() => setContractTab("sent")}
        >
          Sent Contracts
        </button>
        <button
          className={`contract-tab ${contractTab === "signed" ? "active" : ""}`}
          onClick={() => setContractTab("signed")}
        >
          Signed Contracts
        </button>
      </div>

      {contractTab === "create" && (
        <div className="contract-form-container">
          {sendSuccess && <p className="success-message">{sendSuccess}</p>}
          {sendError && <p className="error-message">{sendError}</p>}
          <h3 className="form-title">New Contract</h3>
          <p className="contract-date">
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </p>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="user-search" className="user-label">
                To:
              </label>
              <input
                id="user-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter a username..."
                className="user-input"
              />
              <button onClick={handleSearch} className="user-button">
                Search
              </button>
              <div className="search-results">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className={`search-result-item-contracts ${
                      selectedUser?.id === user.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    {user.username}
                  </div>
                ))}
                {selectedUser && (
                  <p className="selected-user">
                    Selected User: <strong>{selectedUser.username}</strong>
                  </p>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Project Start & End Date:</label>
              <input id="start-date" type="date" />
              <input id="end-date" type="date" />
            </div>
            <div className="form-group">
              <label>Pricing:</label>
              <input id="price" type="text" placeholder="$" />
<input id="cycle" type="text" placeholder="Payment Cycle" />
            </div>
          </div>
          <label>Contract Title</label>
          <input
            type="text"
            value={newContractTitle}
            onChange={(e) => setNewContractTitle(e.target.value)}
            placeholder="Enter contract title"
            className="user-input"
          />
          <div className="form-group-full-width">
            <label>Terms:</label>
            <textarea
              value={newContractContent}
              onChange={(e) => setNewContractContent(e.target.value)}
              placeholder="Enter project details"
            ></textarea>
          </div>
          <div className="button-container-send">
            <button onClick={sendContract} className="user-button-send">
              Send Contract
            </button>
          </div>
        </div>
      )}

      {contractTab === "sent" && (
        <div className="contract-list">
          <h3>Sent Contracts</h3>
          {error && <p className="error-message">{error}</p>}
          {sentContracts.length === 0 ? (
            <p>No sent contracts available.</p>
          ) : (
            <ul>
              {sentContracts.map((contract) => (
                <li key={contract.id} className="contract-item">
                  <p>
                    <strong>Title:</strong> {contract.title}
                  </p>
                  <p>
                    <strong>Recipient:</strong> {contract.recipient}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {contract.is_signed ? "Signed" : "Pending"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {contractTab === "signed" && (
        <div className="contract-list">
          <h3>Signed Contracts</h3>
          {error && <p className="error-message">{error}</p>}
          {sentContracts.filter((c) => c.is_signed).length === 0 ? (
            <p>No signed contracts available.</p>
          ) : (
            <ul>
              {sentContracts
                .filter((c) => c.is_signed)
                .map((contract) => (
                  <li key={contract.id} className="contract-item">
                    <p>
                      <strong>Title:</strong> {contract.title}
                    </p>
                    <p>
                      <strong>Recipient:</strong> {contract.recipient}
                    </p>
                    <p>
                      <strong>Signed Date:</strong>{" "}
                      {contract.signed_date || "N/A"}
                    </p>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

// ------------------- ClientContracts Component -------------------
const ClientContracts = () => {
  
  const [receivedContracts, setReceivedContracts] = useState([]);
  const [signError, setSignError] = useState("");
  const [signSuccess, setSignSuccess] = useState("");
  const [expandedContracts, setExpandedContracts] = useState([]);
  const maxLength = 120;
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/received-contracts/`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      })
      .then((response) => setReceivedContracts(response.data.contracts))
      .catch(() => {});
  }, []);

  const toggleExpand = (contractId) => {
    setExpandedContracts((prev) =>
      prev.includes(contractId)
        ? prev.filter((id) => id !== contractId)
        : [...prev, contractId]
    );
  };
  const handleRateContractor = async (contractorId) => {
    if (rating <= 0 || rating > 5) {
      alert("Please provide a rating between 1 and 5.");
      return;
    }
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/contractors/${contractorId}/rate/`,
        { rating },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );
      setSuccessMessage(response.data.message || "Rating submitted successfully.");
      setErrorMessage("");
    } catch (error) {
      console.error('Error rating contractor:', error);
      setErrorMessage("Failed to submit rating. Please try again.");
    }
  };

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

  const parseContractContent = (content) => {
    const sections = content.split(/\n(?=📅|💰|📄)/g);
    return sections.map((section, i) => {
      const lines = section.trim().split("\n");
      const title = lines[0];
      const body = lines.slice(1);
      return (
        <div key={i} className="contract-parsed-section">
          <h4>{title}</h4>
          {body.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      );
    });
  };

  const signContract = useCallback(async (contractId) => {
    setSignError("");
    setSignSuccess("");
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/sign-contract/`,
        { contract_id: contractId },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );
      setSignSuccess("Contract signed successfully!");
      setReceivedContracts((prev) =>
        prev.map((contract) =>
          contract.id === contractId
            ? { ...contract, is_signed: true }
            : contract
        )
      );
    } catch {
      setSignError("Failed to sign contract. Please try again.");
    }
  }, []);
  console.log("Contract:", receivedContracts);
  return (
    <div className="received-contracts">
      <h2>Received Contracts</h2>
      {signError && <p className="error-message">{signError}</p>}
      {signSuccess && <p className="success-message">{signSuccess}</p>}
      <ul>
        {receivedContracts.map((contract) => {
          const isExpanded = expandedContracts.includes(contract.id);
          const shouldTruncate = contract.content.length > maxLength && !isExpanded;
          const displayedContent = shouldTruncate
            ? contract.content.slice(0, maxLength) + "..."
            : contract.content;

          return (
            <li key={contract.id}>
              <p><strong>Title:</strong> {contract.title}</p>

              <div>
                <strong>Content:</strong>
                <div className="parsed-contract">
                  {parseContractContent(displayedContent)}
                </div>
                {contract.content.length > maxLength && (
                  <button onClick={() => toggleExpand(contract.id)} className="show-more-button">
                    {isExpanded ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>

              <p><strong>Status:</strong> {contract.is_signed ? "Signed" : "Pending"}</p>

              <div className="button-container">
  {!contract.is_signed ? (
    <button
      onClick={() => signContract(contract.id)}
      className="user-button"
    >
      Sign Contract
    </button>
  ) : (
    <>
      <p className="signed">✅ Contract signed!</p>

      <div className="cont-rating-input">
        <h3 className="rating-heading">Rate This Contractor</h3>
        <div className="cont-stars">{renderStars(rating)}</div>
        <button
  onClick={() => handleRateContractor(contract.contractor_id)}
  className="cont-submit-rating-btn"
>
          Submit Rating
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      <Link to="/payment" className="user-button payment-btn">
        💳 Pay Now
      </Link>
    </>
  )}
</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// ------------------- ContractsTab Component -------------------
const ContractsTab = ({ userInfo }) => {
  if (userInfo?.type === "professional") {
    return <ProfessionalContracts />;
  } else if (userInfo?.type === "client") {
    return <ClientContracts />;
  }
  return null;
};

// ------------------- ChatsTab Component -------------------
const ChatsTab = ({ userInfo, username }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [message, setMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null); 
// You can enhance this with a mobile-detection hook
  const totalUnreadCount = conversations.reduce(
    (total, conv) => total + (conv.unread_count || 0),
    0
  );
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);  

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/conversations/`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      })
      .then((response) => setConversations(response.data))
      .catch(() => setError("Failed to load conversations."))
      .finally(() => setLoadingConversations(false));
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      setLoadingMessages(true);
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/conversations/${selectedConversationId}/messages/`,
          { headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          }, }
        )
        .then((response) => setMessages(response.data))
        .catch(() => setError("Failed to load messages."))
        .finally(() => setLoadingMessages(false));
    }
  }, [selectedConversationId]);

  const handleReply = useCallback(async () => {
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }
  
    if (message.includes('@') || message.includes('gmail') || message.includes('yahoo') || message.includes('hotmail')) {
      console.log("❌ Email reference detected in message!");  // Debugging
      setError("Message content cannot contain email references.");
      return; // 🔹 Ensure we exit the function if there's an error
    }
  
    setSending(true);  // 🔹 Only set this once, after passing validation
    setError("");
  
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];
      if (!csrfToken) throw new Error("CSRF token is missing.");
  
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/conversations/${selectedConversationId}/reply/`,
        { content: message },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
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
      
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/unread-messages/`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
    } catch (err) {
      setError("Failed to send the message.");
    } finally {
      setSending(false);
    }
  
  }, [message, selectedConversationId, username]);


  return (
    <div className="chat-container-3">
      <div className="chat-sidebar-3">
        <h2 className="sidebar-header-3"><h2 className="sidebar-header-3">
          Inbox{" "}
          {totalUnreadCount > 0 && (
            <span className="notification-badge">{totalUnreadCount}</span>
          )}
        </h2></h2>
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
                <div className="conversation-item-content">
                  <div className="conversation-name">
                    {userInfo.type === "professional" ? (
                      <strong>{conversation.participants[0]}</strong>
                    ) : (
                      <strong>{conversation.participants[1]}</strong>
                    )}

                     {/* Unread Notification (badge) right next to the name */}
    {conversation.unread_count > 0 && (
      <span className="notification-badge">
        {conversation.unread_count}
      </span>
    )}
                  </div>
                  {conversation.unreadMessages > 0 && (
                    <span className="notification-badge">
                      {conversation.unreadMessages}
                    </span>
                  )}
                </div>
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
                    {new Date(msg.timestamp).toLocaleString([], {
                      weekday: "short",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  
                </div>
              ))}
          <div ref={messagesEndRef} /> 
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
  );
};

// ------------------- PaymentsTab Component -------------------
const PaymentsTab = () => {
  return <div>Payments Content</div>;
};

// ------------------- Main UserProfile Component -------------------
const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [userInfo, setUserInfo] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const username = user?.username;
  const navigate = useNavigate();

  // Fetch user info
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/user-info/`, { headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      }, })
      .then((response) => setUserInfo(response.data))
      .catch(() => setError("Please sign in"));
  }, []);

  // Poll for unread messages
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/unread-messages/`,
          { headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          }, }
        );
        setUnreadMessages(response.data.unread_count);
      } catch (err) {
        console.error("Failed to fetch unread messages.");
      }
    };

    fetchUnreadMessages();
  
  }, []);

  return (
    <div className="user-profile">
      <Sidebar
        activeTab={activeTab}
        unreadMessages={unreadMessages}
        setActiveTab={setActiveTab}
        userInfo={userInfo}
      />
      <div className="main-content">
        {activeTab === "home" && <HomeTab userInfo={userInfo} />}
        {activeTab === "contracts" && <ContractsTab userInfo={userInfo} />}
        {activeTab === "chats" && (
          <ChatsTab userInfo={userInfo} username={username} />
        )}
        {activeTab === "payments" && <PaymentsTab />}
      </div>
    </div>
  );
};

export default UserProfile;