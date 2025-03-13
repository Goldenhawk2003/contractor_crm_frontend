import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { uid, token } = useParams(); // Fetching from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/reset-password/${uid}/${token}/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }, // Only Content-Type
          body: JSON.stringify({ new_password: password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Password reset successfully. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        // Handle different error response formats
        setError(data.error || data.detail || '❌ An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Reset error:', error);
      setError('❌ Failed to connect to server');
    }
  };

  return (
    <div className="form-container">
      <h2>🔑 Reset Password</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your new password"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;