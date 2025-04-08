import React, { useState, useEffect } from 'react';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    role: 'client',
    job_type: '',
    hourly_rate: '',
    logo: null,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (!window.google) return;

    const input = document.getElementById('location-autocomplete');
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ['geocode'],
      componentRestrictions: { country: 'ca' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const formattedAddress = place.formatted_address;
      setFormData((prev) => ({ ...prev, location: formattedAddress }));
    });
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'logo') {
      setFormData({ ...formData, logo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword, hourly_rate, role, logo } = formData;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username) return "Username is required";
    if (!email || !emailPattern.test(email)) return "Please enter a valid email address";
    if (password.length < 6) return "Password should be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    if (role === 'professional') {
      if (!formData.job_type) return "Job type is required for professionals";
      if (!hourly_rate || isNaN(hourly_rate) || hourly_rate <= 0) return "Hourly rate must be a positive number";
      if (!logo) return "Logo is required for professionals";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const formDataPayload = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        formDataPayload.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/register/`, {
        method: 'POST',
        body: formDataPayload,
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setError('');
        setFormData({
          username: '',
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          confirmPassword: '',
          location: '',
          role: 'client',
          job_type: '',
          hourly_rate: '',
          logo: null,
        });
      } else {
        setError(data.error || "An error occurred during registration");
      }
    } catch (error) {
      setError("Failed to connect to the server");
    }
  };

  return (
    <div className='signup-page'>
      <h1 className='sign-up-header'>Welcome to ETN</h1>
      <form onSubmit={handleSubmit} className="cont">

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
          className='inp'
        />
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          placeholder="First Name"
          required
          className='inp'
        />
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          placeholder="Last Name"
          required
          className='inp'
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className='inp'
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className='inp'
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
          className='inp'
        />

        <input
          id="location-autocomplete"
          type="text"
          placeholder="Enter location"
          className="inp"
          value={formData.location}
          onChange={handleChange}
        />

        <button className='sbmit' type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;