import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Contractorsedit.css';

const ContractorForm = () => {
  const { id } = useParams(); // This is the user ID
  const navigate = useNavigate();
  const [contractorData, setContractorData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
  });
  const [contractorId, setContractorId] = useState(null); // Store contractor ID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch contractor data by user ID
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contractors/by-user/${id}/`, {
        method: 'GET',
        credentials: 'include', // Ensure cookies are sent
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 403) throw new Error('Forbidden: Access denied.');
            if (response.status === 404) throw new Error('Contractor not found for this user.');
            throw new Error('Failed to fetch contractor data.');
          }
          return response.json();
        })
        .then((data) => {
          setContractorData(data);
          setContractorId(data.id); // Store contractor ID
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    setContractorData({ ...contractorData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!contractorData.first_name || !contractorData.last_name) {
      setError('First and Last names are required.');
      return false;
    }
    if (contractorData.email && !/\S+@\S+\.\S+/.test(contractorData.email)) {
      setError('Invalid email format.');
      return false;
    }
    if (contractorData.phone && !/^\d{10}$/.test(contractorData.phone)) {
      setError('Phone number must be 10 digits.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
    setError(null);
  
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/contractors/${contractorId}/`;
      const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({ ...contractorData, location: contractorData.location }),
      });
  
      if (!response.ok) {
        throw new Error(await response.text());
      }
  
      setSuccessMessage('Contractor updated successfully!');
      navigate('/contractors'); // Redirect after success
    } catch (err) {
      setError(err.message || 'Failed to update contractor data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contractor-form">
      <h2>Edit Contractor</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">First Name</label>
        <input
          id="first_name"
          type="text"
          name="first_name"
          value={contractorData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <label htmlFor="last_name">Last Name</label>
        <input
          id="last_name"
          type="text"
          name="last_name"
          value={contractorData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={contractorData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={contractorData.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            name="location"
            value={contractorData.location}
            onChange={handleChange}
            placeholder="Location"
          />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Update Contractor'}
        </button>
      </form>
    </div>
  );
};

// Utility function to get CSRF token
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

export default ContractorForm;