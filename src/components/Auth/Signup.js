import React, { useState } from 'react';

function Signup() {
  const [formData, setFormData] = useState({
    username: '', // Add username field
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client', // default role
  });

  const [error, setError] = useState(''); // For displaying error messages

  const handleChange = (e) => {
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
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.message) {
        alert(data.message); // Display success message
      } else {
        setError("An error occurred during registration");
      }
    } catch (error) {
      setError("Failed to connect to the server");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        required
      />
      
      <label>
        <input
          type="radio"
          name="role"
          value="client"
          checked={formData.role === 'client'}
          onChange={handleChange}
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
        />
        Professional
      </label>
      
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;