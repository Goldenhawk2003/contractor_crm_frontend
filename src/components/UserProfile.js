import React, { useState, useEffect, useCallback,useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./UserProfile.css";
import { useAuth } from "../context/AuthContext";
import { FaCheckCircle } from 'react-icons/fa';
import ReviewForm from "./Reviews/ReviewForm";
import ReviewList from "./Reviews/ReviewList";
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { useMemo } from 'react';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';


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
  useEffect(() => {
      // Add a class to the body for this specific page
      document.body.classList.add("specific-page-user-profile");
  
      // Clean up by removing the class when the component is unmounted
      return () => {
        document.body.classList.remove("specific-page-user-profile");
      };
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
  const [refreshKey, setRefreshKey] = useState(0);

  const editProfile = useCallback(() => {
    if (userInfo?.type === "client") {
      navigate("/edit-profile");
    } else {
      navigate("/edit-profile");
    }
  }, [navigate, userInfo]);
    const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      phone_number: '',
      profile_description: '',
      type: '',
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
      if (userInfo) {
        setFormData({
          first_name: userInfo.first_name || '',
          last_name: userInfo.last_name || '',
          phone_number: userInfo.phone_number || '',
          profile_description: userInfo.description || '',
          type: userInfo.type || '',
        });
      }
    }, [userInfo]);
    console.log("Submitting form data:", formData);
    
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
   
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const token = localStorage.getItem('access_token');
      if (!token) {
          setMessage('User not authenticated. Please log in.');
          return;
      }
  
      try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/update-user/`, {
              method: 'PUT',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
          });
  
          if (response.ok) {
              const data = await response.json();
              setMessage(`User updated successfully! Name: ${data.first_name} ${data.last_name}`);
              console.log('Success:', data);
              setFormData(prev => ({
                ...prev,
                phone_number: data.phone_number || ''
              }));
          } else if (response.status === 401) {
              setMessage('Unauthorized: Please log in again.');
              localStorage.removeItem('access_token'); // Clear the token if unauthorized
          } else if (response.status === 405) {
              setMessage('Method Not Allowed: Please check the request method.');
          } else {
              const errorData = await response.json();
              setMessage(`Error: ${errorData.detail || 'Update failed'}`);
              console.error('Error:', errorData);
          }
      } catch (error) {
          setMessage('Network error');
          console.error('Network error:', error);
      }
  };
  

  return (
    <div className="tab-content">
      {userInfo ? (
        <div className="profile">
           {!userInfo.is_verified && userInfo.type === "professional"&& (
        <div className="verify-banner">
          <Link to="/license" className="verify-link">
            ⚠️ Get Verified By Submitting Your License/Business Number
          </Link>
        </div>
      )}
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
          <div className="profile-container">
            <p className="profile-username">{userInfo.username} {userInfo.is_verified &&  <FaCheckCircle
    className="verified-icon"
    title="Verified contractor"
  />}</p>
           
            {userInfo.type === "professional" && (
              <>
              <div className="profile-blue-box">
                <p className="profile-blue">{userInfo.job_type}</p>
                <p className="profile-blue">{userInfo.location}</p>
                </div>
                <StarRating ratingValue={userInfo.rating} className="star-rating" />
              </>
            )}
          </div>
          <div className="edit-profile-user">
      <form className="edite-profile-form-user" onSubmit={handleSubmit}>
        <h2 className="edit-profile-header">Update User Information</h2>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          className="edit-profile-input"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          className="edit-profile-input"
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          className="edit-profile-input"
        />
        {userInfo.type === "professional" && (
      <textarea
        rows="4"
        name="profile_description"
        placeholder="Describe your services, experience, etc."
        value={formData.profile_description}
        onChange={handleChange}
        className="edit-profile-input"
    
      />
      
    )}
 
        <button type="submit" className="edit-profile-button">
          Update
        </button>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </form>
    </div>
    {userInfo.type === "professional" && (
    <section className="reviews-section mt-8">
            <h3 className="text-xl font-semibold">Reviews</h3>
            <ReviewList contractorId={userInfo.contractor_id} key={refreshKey} />
           
          </section>
)}
        
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

  const [price, setPrice] = useState('');
  const [cycle, setCycle] = useState('');

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]   = useState("");
    const [rows, setRows] = useState([
    { description: '', qty: 1, price: 0 }
  ]);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    if (field === 'qty' || field === 'price') {
      updatedRows[index][field] = Number(value);
    } else {
      updatedRows[index][field] = value;
    }
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { description: '', qty: 1, price: 0 }]);
  };



const total = useMemo(() => {
  return rows.reduce((sum, row) => sum + row.qty * row.price, 0);
}, [rows]);

   const extractTextFromPdf = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        fullText += strings.join(' ') + '\n';
      }

      setNewContractContent(fullText);
      setError(null);
    } catch (err) {
      console.error('Failed to extract text from PDF', err);
      setError('Failed to extract text from PDF');
    }
  };
   const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      extractTextFromPdf(file);
    }
  };
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
    const currentTotal = rows.reduce((sum, row) => sum + row.qty * row.price, 0);
    console.log("📦 Submitting contract with total price:", currentTotal.toFixed(2));
    const fileInput = document.getElementById("contract-file");
    const file = fileInput?.files?.[0] || null;
  
  const fullContent = `
📅 Project Dates:
  Start: ${startDate || "Not specified"}
  End:   ${endDate   || "Not specified"}

💰 Pricing:
${rows.map((r, i) => `  ${i + 1}. ${r.description} — ${r.qty} × $${r.price} = $${r.qty * r.price}`).join('\n')}
  Total: $${total.toFixed(2)}

📄 Terms:
${newContractContent}
  `;
  
const formData = new FormData();
  formData.append("user_id", selectedUser.id);
  formData.append("title", newContractTitle);
  formData.append("contractContent", fullContent);
  console.log("📦 Submitting contract with total price:", total.toFixed(2));
  formData.append("total_price", currentTotal.toFixed(2));

  if (fileInput?.files?.[0]) {
    formData.append("file", fileInput.files[0]);
  }

  try {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/send-contract/`, formData, {
      headers: {
        ...getAuthHeaders(), // Do NOT set Content-Type manually; axios will handle it
      },
    });
    setSendSuccess("Contract sent successfully!");
    setSelectedUser(null);
    setNewContractTitle("");
    setNewContractContent("");
    fileInput.value = ""; // Reset file input
  } catch (err) {
    console.error(err);
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
      {/* --- Tabs --- */}
      <div className="contract-tabs">
        {['create','sent','signed'].map((tab) => (
          <button
            key={tab}
            className={`contract-tab ${contractTab===tab ? 'active' : ''}`}
            onClick={() => setContractTab(tab)}
          >
            {tab === 'create' ? 'Create New Contract'
             : tab === 'sent'   ? 'Sent Contracts'
             : 'Signed Contracts'}
          </button>
        ))}
      </div>

      {/* --- Create Tab --- */}
      {contractTab === 'create' && (
        <div className="contract-form-container">
          {sendSuccess && <p className="success-message">{sendSuccess}</p>}
          {sendError   && <p className="error-message">{sendError}</p>}
          <div className="contract-header">
          <img src="/images/logos/logos-header/darketn-07.png" alt="Contract" className="contract-image" />
          <h3 className="form-title">INVOICE</h3>
          </div>
          <p className="contract-date">
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </p>

              <div className="form-group-full-width">
            <label>Title:</label>
            <input
              type="text"
              value={newContractTitle}
              onChange={(e) => setNewContractTitle(e.target.value)}
              placeholder="Enter contract title…"
              className="user-input"
            />
          </div>

          {/* Recipient */}
                <div className="recipient-container">
                    <p className="section-title">Recipient</p>
                     <input
                id="user-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter a username…"
                className="user-input"
              />
                      </div>
        
          <div className="form-grid">
           
           <div className="search-results">
  {selectedUser ? (
    <>
    <div className="result-item">
      <div className="search-result-item-contracts selected">
        {selectedUser.username}
      </div>
      <button
        className="contract-search-button"
        style={{ marginTop: "10px" }}
        onClick={() => setSelectedUser(null)}
      >
        Change
      </button>
      </div>
    </>
  ) : (
    searchResults.map((u) => (
      <div
        key={u.id}
        className="search-result-item-contracts"
        onClick={() => setSelectedUser(u)}
      >
        {u.username}
      </div>
    ))
  )}
</div>
              <button onClick={handleSearch} className="contract-search-button">
                Search
              </button>

        
            </div>
      

          {/* Project Dates */}
          <p className="section-title">Project Info</p>
          <div className="form-grid">
                <div className="form-group">
              <label>Start Date:</label>
      <input
  id="start-date"
  type="date"
  className="user-input"
  value={startDate}
  onChange={e => setStartDate(e.target.value)}
/>
            </div>
            <div className="form-group">
              <label>End Date:</label>
              <input id="end-date" type="date" className="user-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
             <div className="invoice-table-container">
      <table className="invoice-table">
        <thead>
          <tr>
            <th>NO</th>
            <th>DESCRIPTION</th>
            <th>QTY</th>
            <th>PRICE</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const rowTotal = row.qty * row.price;
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={row.qty}
                    onChange={(e) => handleChange(index, 'qty', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={row.price}
                    onChange={(e) => handleChange(index, 'price', e.target.value)}
                  />
                </td>
                <td>${rowTotal.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

<div className="invoice-table-buttons">
      <button className="add-row-button" onClick={addRow}>
        + Add Row
      </button>
      <button className="add-row-button" onClick={() => setRows(rows.slice(0, -1))}>
        - Remove Row
      </button>
      </div>
         <div className="summary-bar">
            <span className="summary-label">TOTAL:</span>
            <span className="summary-value">${total.toFixed(2)}</span>
          </div>
    </div>
        
          </div>

          {/* Pricing */}
         
      

          {/* Contract Details */}
          <p className="section-title">Contract Details</p>
      

          <div className="form-group-full-width contract-file">
            <label htmlFor="contract-file">Attach File:</label>
            <input
              id="contract-file"
              type="file"
              accept=".pdf,.doc,.docx"
              className="file-input"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group-full-width">
            <label>Terms:</label>
            <textarea
              rows={4}
              value={newContractContent}
              onChange={(e) => setNewContractContent(e.target.value)}
              placeholder="Enter project details…"
              className="user-input"
            />
          </div>



          {/* Submit */}
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
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openContract, setOpenContract] = useState(null); // For modal pop-up
  const [refreshKey, setRefreshKey] = useState(0);
  const [openId, setOpenId] = useState(null); 

  // Maximum length before showing the pop-up instead of inline expand
  const maxLength = 120;

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

  const handleCheckout = async (contractId) => {
  const token = localStorage.getItem("access_token");

const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/create-checkout-session/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contract_id: contractId }),
  });

  const data = await res.json();
  if (data.checkout_url) {
    window.location.href = data.checkout_url;
  } else {
    alert("Failed to create checkout session.");
  }
};



  // Function to parse and display contract content
const parseContractContent = (content) => {
  const lines = content.split("\n").map((l) => l.trim());

  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i] === "Project" && lines[i + 1] === "Dates:") {
      lines[i] = "Project Dates:";
      lines.splice(i + 1, 1);
    }
  }

  const sections = lines.join("\n").split(/\n(?=📅|💰|📄)/g);

  return sections.map((section, i) => {
    const sublines = section.trim().split("\n");
    const title = sublines[0];
    const body = sublines.slice(1);

    // 🧠 Special case: pricing section → render as table
    if (title.startsWith("💰 Pricing")) {
      const rowLines = body.filter((line) => /^\d+\.\s+/.test(line));
      const totalLine = body.find((line) => line.startsWith("Total:"));

      const parsedRows = rowLines.map((line) => {
        const match = line.match(/^(\d+)\.\s+(.*?)\s+—\s+(\d+)\s+×\s+\$(\d+(?:\.\d+)?)\s+=\s+\$(\d+(?:\.\d+)?)/);
        if (!match) return null;
        const [, , description, qty, price] = match;
        return {
          description,
          qty: parseInt(qty),
          price: parseFloat(price),
        };
      }).filter(Boolean);

      const tableTotal = totalLine ? totalLine.replace("Total:", "").trim() : "";

      return (
        <div key={i} className="contract-parsed-section">
          <div className="section-title">💰 Pricing</div>
          <div className="invoice-table-container">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>NO</th>
                <th>DESCRIPTION</th>
                <th>QTY</th>
                <th>PRICE</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {parsedRows.map((row, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{row.description}</td>
                  <td>{row.qty}</td>
                  <td>${row.price.toFixed(2)}</td>
                  <td>${(row.qty * row.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="summary-bar">
            <span className="summary-label">TOTAL:</span>
            <span className="summary-value">{tableTotal}</span>
          </div>
        </div>
      );
    }

    // 🔁 Default rendering for other sections
    return (
      <div key={i} className="contract-parsed-section">
        <div className="section-title">{title}</div>
        <div className="section-content">
          {body.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
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
          contract.id === contractId ? { ...contract, is_signed: true } : contract
        )
      );
    } catch {
      setSignError("Failed to sign contract. Please try again.");
    }
  }, []);

  // Open the modal by setting the selected contract
  const openContractModal = (contract) => {
    setOpenContract(contract);
    console.log("Contract:", contract);
  };

  // Close the modal
  const closeModal = () => {
    setOpenContract(null);
  };

    return (
    <div className="received-contracts">
    
      <h2>Received Contracts</h2>
      {signError && <p className="error-message">{signError}</p>}
      {signSuccess && <p className="success-message">{signSuccess}</p>}

     {receivedContracts.map((contract) => {
        const isOpen = openId === contract.id;
        const shouldTruncate = contract.content?.length > maxLength;
        const preview = shouldTruncate
          ? contract.content.slice(0, maxLength) + "…"
          : contract.content;

        return (
        <div key={contract.id} className="contract-card-accordion">
            {/* Header Click */}
            <div
              className="accordion-summary"
             onClick={() => {
  console.log("Toggling accordion for ID:", contract.id);
  setOpenId(isOpen ? null : contract.id);
}}
            >
             
              <span> {contract.title}</span> 
              <span className={`arrow ${isOpen ? "open" : ""}`}>▾</span>
            </div>

            {isOpen && (
              <div className="contract-form-container">
                {/* Info */}
                  <span className="section-title"></span>
                    <div className="contract-header">
          <img src="/images/logos/logos-header/darketn-07.png" alt="Contract" className="contract-image" />
          <h3 className="form-title">INVOICE</h3>
          </div>
          <div className="contract-info">
            <p> <strong>Title:</strong> <span>{contract.title}</span></p> 
            <p> <strong>Contractor:</strong> {contract.sender}</p>
            <p> <strong>Status:</strong>{" "}
                <span>{contract.is_signed ? "Signed" : "Pending"}</span> </p> 
            <p className="contract-date">
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </p>
          </div>
             
         

                {/* Details */}
               
                <div className="form-group-full-width">
  {contract.content ? (
    parseContractContent(contract.content).length > 0 ? (
      parseContractContent(contract.content)
    ) : (
      <p>{contract.content}</p>
    )
  ) : (
    <p>No content available</p>
  )}
</div>

                {/* Actions */}
                <p className="section-title">Actions</p>
                <div className="sign">
                  {!contract.is_signed ? (
                    <div className="form-group">
                      <button
                        onClick={() => signContract(contract.id)}
                        className="user-button"
                      >
                        Sign Contract
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="post-sign-box">

<div>
                        <p className="signed">✅ Contract Signed</p>
                      <button
  className="user-button payment-btn"
  onClick={() => handleCheckout(contract.id)}
>
  💳 Pay Now
</button>
                        </div>
                        <ReviewForm
                          contractorId={contract.contractor_id}
                          onSuccess={() => setRefreshKey((k) => k + 1)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
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
const PaymentsTab = ({ userInfo }) => {
  const handleStripeConnect = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/create-stripe-link/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No URL returned from Stripe.");
      }
    } catch (err) {
      console.error("Failed to create Stripe onboarding link:", err);
      alert("There was a problem connecting to Stripe.");
    }
  };

  return (
    <div>
     {userInfo?.type === "professional" && userInfo?.stripe_account_id ? (
  <p>You are connected to Stripe. ✅</p>
) : (
  <div className="stripe-connect-banner">
    <button className="stripe-connect-button" onClick={handleStripeConnect}>
      Connect with Stripe
    </button>
  </div>
)}
    </div>
  );
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
        {activeTab === "payments" && <PaymentsTab userInfo={userInfo} />}
      </div>
    </div>
  );
};

export default UserProfile;