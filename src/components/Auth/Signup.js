import React, { useState } from 'react';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '', // Add username field
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    role: 'client', // default role
    job_type: '', // Changed field name from jobType to job_type to match backend
  });

  const [error, setError] = useState(''); // For displaying error messages

  const handleChange = (e) => {
    console.log('Selected rile: ${event.target.value}`');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add form validation
  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username) {
      return "Username is required";
    }
    if (!email || !emailPattern.test(email)) {
      return "Please enter a valid email address";
    }
    if (password.length < 6) {
      return "Password should be at least 6 characters";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    if (formData.role === 'professional' && !formData.job_type) {
      return "Job type is required for professionals";
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

    // Exclude confirmPassword from the payload
    const { confirmPassword, ...payload } = formData;

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Display success message
        setError(''); // Clear error state
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
        }); // Reset form fields
      } else {
        setError(data.error || "An error occurred during registration");
      }
    } catch (error) {
      setError("Failed to connect to the server");
    }
  };

  return (
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
      placeholder='First Name'
      required
      className='inp'
      />

      <input
      type="text"
      name="lastname"
      value={formData.lastname}
      onChange={handleChange}
      placeholder='Last Name'
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
      type="text"
      name="location"
      value={formData.location}
      onChange={handleChange}
      placeholder='City Name'
      required
      className='inp'
      />
      
      <label>
        <input
          type="radio"
          name="role"
          value="client"
          checked={formData.role === 'client'}
          onChange={handleChange}
          className='radio'
        />
        Client
      </label>
      <label>
        <input
          type="radio"
          name="role"
          value="professional"
          checked={formData.role === 'professional'}
          onChange={handleChange}
          className='radio'
        />
        Professional
      </label>
      
      {formData.role === 'professional' && (
        <input
          type="text"
          name="job_type" // Changed from jobType to job_type
          value={formData.job_type}
          onChange={handleChange}
          placeholder="Job Type (e.g., Plumber, Renovator)"
          required
        />
      )}
      
      <button className='sbmit' type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;