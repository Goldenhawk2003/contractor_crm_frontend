import React, { useState } from 'react';
import axios from 'axios';
import './VerifyLicense.css'; // Assuming you have some CSS for styling

// Backend base URL
const BASE_URL = 'https://ecc-backend-31b43c38f51f.herokuapp.com';

// Helper to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    console.log('✅ Using token for auth header:', token);
    return { Authorization: `Bearer ${token}` };
  }
  console.log('🚫 No token found. Sending request without auth.');
  return {};
};

const LicenseForm = () => {
  const [license, setLicense] = useState('');
  const [status, setStatus]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    };

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/submit-license/`,
        { license_number: license.trim() },
        { headers }
      );

      setStatus({
        success: true,
        message: data.verified
          ? '✅ License verified!'
          : '⚠️ License submitted but not verified.',
      });
    } catch (err) {
      console.error('License submission error:', err.response || err);
      setStatus({
        success: false,
        message: err.response?.data?.error || 'Error submitting license',
      });
    }
  };

  return (
    <div className="license-wrapper">
      <div className="license-hero">
        <h1 className="license-header">Verify Your Contractor License</h1>
        <p className="license-subheader">
          Enter your 9-digit license number to be recognized as a verified contractor.
        </p>
      </div>

      <div className="license-container">
        <form onSubmit={handleSubmit} className="license-form">
          <label className="license-label">License Number</label>
          <input
            type="text"
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            maxLength={9}
            placeholder="123456789"
            required
            className="license-input"
          />
          <button type="submit" className="license-button">
            Submit
          </button>
        </form>

        {status && (
          <p className={`license-status ${status.success ? 'success' : 'error'}`}> 
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LicenseForm;
