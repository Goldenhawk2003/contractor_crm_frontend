// Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch CSRF token once on component mount
    useEffect(() => {
        const initializeCsrfToken = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/csrf_token/`, {
                    withCredentials: true,
                });
                console.log("CSRF Token Fetched:", response.data.csrfToken);
                // No need to manually set cookie; Django does this
            } catch (error) {
                console.error("Error fetching CSRF Token:", error);
            }
        };
        initializeCsrfToken();
    }, []);

    // Get CSRF token from cookies
    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(''); // Clear previous errors

        try {
            const csrfToken = getCookie('csrftoken');
            if (!csrfToken) {
                setError("CSRF token not found. Please refresh and try again.");
                return;
            }

            console.log("Using CSRF Token:", csrfToken);

            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/login/`,
                { username, password },
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            console.log("Login successful:", response.data);
            navigate('/user-profile');
            window.location.reload();
        } catch (err) {
            console.error("Login failed:", err.response ? err.response.data : err.message);
            setError("Login failed. Please check your credentials and try again.");
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