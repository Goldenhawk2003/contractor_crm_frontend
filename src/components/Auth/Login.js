import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser } = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/token/`, {
                username,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false,
            });
    
            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            // Update context state manually
            setIsAuthenticated(true);
            // Optionally, you might want to fetch user info:
            const userResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user-info/`);
            setUser(userResponse.data);
    
            navigate('/user-profile');
        } catch (err) {
            console.error('Login failed:', err.response ? err.response.data : err.message);
            setError('Login failed. Please try again.');
        }
    };
    
    return (
        <div className="log-container">
            <form onSubmit={handleLogin} className="contain">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <h2 className="log-header">Welcome Back!</h2>
                <input
                    className="log"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    className="log"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" className="sub">Login</button>
            </form>
            <div className="divider"></div>
            <div className="sign-up">
                <h2 className="log-header">New to Elite Craft?</h2>
                <Link to="/signup" className="sub">Sign Up</Link>
            </div>
        </div>
    );
};

export default Login;