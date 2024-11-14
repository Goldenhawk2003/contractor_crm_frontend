import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; // Assuming you've set up axios instance or use direct API call

const UserProfile = () => {
  const { isAuthenticated } = useAuth();  // Check if the user is logged in
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserProfile = async () => {
        try {
          const response = await api.get('/api/user-profile/'); // Fetch the logged-in user's profile
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>First Name:</strong> {userData.first_name}</p>
      <p><strong>Last Name:</strong> {userData.last_name}</p>
    </div>
  );
};

export default UserProfile;