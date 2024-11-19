import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Fetch the logged-in user's info from the backend
        axios
            .get('http://localhost:8000/api/user-info/', {
                withCredentials: true, // Ensure the session cookie is sent with the request
            })
            .then((response) => {
                setUserInfo(response.data); // Store the user info in state
            })
            .catch((error) => {
                console.error(
                    'Failed to fetch user info:',
                    error.response ? error.response.data : error.message
                );
            });
    }, []);

    if (!userInfo) {
        return <p>Loading user info...</p>; // Show loading message while fetching data
    }

    return (
        <div className="user-profile">
            <div className="profile-card">
                <h1>User Profile</h1>
                <div className="profile-info">
                    <p>
                        <strong>Username:</strong> {userInfo.username}
                    </p>
                    <p>
                        <strong>Email:</strong> {userInfo.email}
                    </p>
                    <p>
                        <strong>Name:</strong> {userInfo.first_name} {userInfo.last_name}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;