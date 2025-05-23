import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Make sure this is at the top

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  // If you're using Django or any CSRF-based backend:
  const getCSRFToken = () => {
    const cookie = document.cookie.split('; ').find((row) => row.startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : null;
  };

  useEffect(() => {
    axios.defaults.headers.common['X-CSRFToken'] = getCSRFToken();
  }, []);

  const { loginUser } = useAuth(); // ← get login function from context

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/token/`, {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
      });
  
      const { access, refresh } = response.data;
    
  
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
  
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
  
      await loginUser();  // ← this triggers update in context (fetch user + update isAuthenticated)
      const params = new URLSearchParams(location.search);
      const next = params.get("next") || "/user-profile";

      navigate(next);
      window.location.reload(); 
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add or remove a page-specific class for backgrounds or special styles
  useEffect(() => {
    document.body.classList.add('specific-page-login');
    return () => {
      document.body.classList.remove('specific-page-login');
    };
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="box-content">
          {/* Left Column: Login Form */}
          <div className="form-section">
            <h2 className="box-header">Welcome Back!</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin} noValidate>
              <div className="input-group">
                <label htmlFor="username" className="input-label">Username:</label>
                <input
                  id="username"
                  className="log"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your Email/Username"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password" className="input-label">Password:</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="inp"
                  />
                  <span onClick={() => setShowPassword(prev => !prev)} className="eye-icon">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
             
              </div>
              <button type="submit" className="sub" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="forgot-password-container">
              <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
            </div>
          </div>
<div className='divider'></div>
          {/* Right Column: Sign-Up Prompt */}
          <div className="signup-section">
            <h2 className="box-header">New to ETN?</h2>
            <Link to="/signup" className="sub-link">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;