import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Optional: To show error messages

    const navigate = useNavigate(); // Initialize useNavigate

    const getCSRFToken = () => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        return cookie ? cookie.split('=')[1] : null;
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const csrfToken = getCSRFToken();
            console.log('CSRF Token:', csrfToken);

            const response = await axios.post(
                'http://localhost:8000/api/login/', // Your Django API endpoint
                { username, password },
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            console.log('Login successful:', response.data);
            
            // Redirect to user profile page or home
            navigate('/user-profile'); // Change to '/home' or another route if needed
        } catch (error) {
            console.error(
                'Login failed:',
                error.response ? error.response.data : error.message
            );
            setError(error.response?.data?.error || 'Login failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleLogin} className="contain">
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
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

            <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </form>
    );
};

export default Login;