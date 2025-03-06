import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const getCSRFToken = () => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        return cookie ? cookie.split('=')[1] : null;
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const csrfToken = getCSRFToken();
            console.log('CSRF Token:', csrfToken);

            await axios.post(
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

            navigate('/user-profile'); // Redirect after successful login
            window.location.reload(); 
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