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
    const [error, setError] = useState(null);

    // Fetch user profile information
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/user-info/", {
                withCredentials: true, // Ensures cookies are sent with the request
            })
            .then((response) => {
                setUserInfo(response.data);
            })
            .catch((error) => {
                console.error(
                    "Failed to fetch user info:",
                    error.response ? error.response.data : error.message
                );
                setError("Failed to load user information. Please try again later.");
            });
    }, []);
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/user-consents/", {
                withCredentials: true,
            })
            .then((response) => {
                setConsents(response.data.consents);
            })
            .catch((error) => {
                console.error(
                    "Failed to fetch consents:",
                    error.response ? error.response.data : error.message
                );
            });
    }, []);

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!userInfo) {
        return <p className="loading-message">Loading user info...</p>;
    }

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

                {/* Display Logo */}
                {logoUrl && (
                    <div className="profile-logo">
                       
                        <img
                            src={logoUrl}
                            alt="User Logo"
                            style={{ width: "100px", height: "100px", objectFit: "contain" }}
                        />
                    </div>
                )}

                <div className="profile-info">
                    <p>
                        <strong>Username:</strong> {userInfo.username || "N/A"}
                    </p>
                    <p>
                        <strong>Email:</strong> {userInfo.email || "N/A"}
                    </p>
                    <p>
                        <strong>Name:</strong> {userInfo.first_name || "N/A"} {userInfo.last_name || ""}
                    </p>
                    <p>
                        <strong>Type:</strong> {userInfo.type || "N/A"}
                    </p>
                </div>

                <Link
    to={
        userInfo.type === "client"
            ? `/clients/edit/${userInfo.id}`
            : `/contractors/edit/${userInfo.id}`
    }
    className="edit-link"
>
    Edit Profile
</Link>
            </div>

            <div className="consents-section">
                <h2>Consented Contracts</h2>
                {consents.length > 0 ? (
                    <ul>
                        {consents.map((consent, index) => (
                            <li key={index}>
                                <strong>Contract ID:</strong> {consent.contract_id} <br />
                                <strong>Signed At:</strong> {new Date(consent.signed_at).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No contracts consented to yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;