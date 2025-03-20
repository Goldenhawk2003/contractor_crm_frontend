import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profile_picture: null, // New field for profile picture
  });

  useEffect(() => {
    // Fetch user profile data from backend
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/`, { withCredentials: true })
      .then((response) => {
        setProfileData(response.data);
      })
      .catch((error) => console.error('Error fetching profile:', error));
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfileData({ ...profileData, profile_picture: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in profileData) {
      formData.append(key, profileData[key]);
    }

    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/api/profile/update/`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        alert('Profile updated successfully!');
        navigate('/dashboard');
      })
      .catch((error) => console.error('Error updating profile:', error));
  };

  return (
    <div className="profile-form">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={profileData.name} onChange={handleChange} placeholder="Name" required />
        <input type="email" name="email" value={profileData.email} onChange={handleChange} placeholder="Email" required />
        <input type="tel" name="phone" value={profileData.phone} onChange={handleChange} placeholder="Phone" />
        <input type="text" name="address" value={profileData.address} onChange={handleChange} placeholder="Address" />
        <input type="file" name="profile_picture" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;