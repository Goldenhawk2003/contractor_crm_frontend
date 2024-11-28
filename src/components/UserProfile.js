import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';

// Function to retrieve CSRF token from cookies
const getCSRFToken = () => {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1);
        }
    }
    console.error('CSRF token not found');
    return null;
};

axios.defaults.headers.common['X-CSRFToken'] = getCSRFToken();

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    console.log('User Info:', userInfo);

    useEffect(() => {
        axios
            .get('http://localhost:8000/api/user-info/', {
                withCredentials: true, // Ensures cookies are sent with the request
            })
            .then((response) => {
                console.log('User Info:', response.data); 
                setUserInfo(response.data); // Store the user info in state
                setError(null); // Clear errors if successful
            })
            .catch((error) => {
                console.error(
                    'Failed to fetch user info:',
                    error.response ? error.response.data : error.message
                );
                setError('Failed to load user information. Please try again later.');
            });
    }, []);

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!userInfo) {
        return <p className="loading-message">Loading user info...</p>;
    }

    // Determine the link destination based on the user type
    const profilePage =
        userInfo.type === 'professional'
            ? `/contractors/edit/${userInfo.id}`
            : `/clients/edit/${userInfo.id}`;

    return (
        <div className="user-profile">
            <div className="profile-card">
                <h1>User Profile</h1>
                <div className="profile-info">
                    <p>
                        <strong>Username:</strong> {userInfo.username || 'N/A'}
                    </p>
                    <p>
                        <strong>Email:</strong> {userInfo.email || 'N/A'}
                    </p>
                    <p>
                        <strong>Name:</strong>{' '}
                        {userInfo.first_name || 'N/A'} {userInfo.last_name || ''}
                    </p>
                    <p>
                        <strong>Type:</strong> {userInfo.type|| 'N/A'}
                    </p>
                </div>
                {/* Conditional Button */}
                <Link to={profilePage} className="edit-link">
                    Edit Profile
                </Link>
            </div>
        </div>
    );
};

export default UserProfile;