import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profile_picture: null, // New field for profile picture
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/`, {
        withCredentials: true,
      })
      .then((response) => {
        const { name, email, phone, address, profile_picture } = response.data;
        setProfileData({
          name: name || "",
          email: email || "",
          phone: phone || "",
          address: address || "",
          profile_picture: profile_picture || null,
        });
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfileData({ ...profileData, profile_picture: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
  
    const formData = new FormData();
  
    for (const key in profileData) {
      formData.append(key, profileData[key]);
    }
  
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/api/profile/update/`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => {
        setSuccessMsg("Profile updated successfully!");
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        setErrorMsg("Something went wrong. Please try again.");
      })
      .finally(() => setLoading(false));
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
        {profileData.profile_picture && typeof profileData.profile_picture === "object" && (
        <img
          src={URL.createObjectURL(profileData.profile_picture)}
          alt="Preview"
          className="profile-preview"
        />
      )}
      {profileData.profile_picture && typeof profileData.profile_picture === "string" && (
        <img
          src={profileData.profile_picture}
          alt="Current"
          className="profile-preview"
        />
      )}
        <button type="submit">Save Changes</button>
        {loading && <p className="loading">Updating profile...</p>}
{successMsg && <p className="success-message">{successMsg}</p>}
{errorMsg && <p className="error-message">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default EditProfile;