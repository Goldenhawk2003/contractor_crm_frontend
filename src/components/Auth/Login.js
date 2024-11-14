// src/components/Auth/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const csrfToken = localStorage.getItem('csrfToken');  // Get CSRF token from localStorage

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:8000/api/login/',  // Your Django login endpoint
                { username, password },
                {
                    headers: {
                        'X-CSRFToken': csrfToken,  // Attach CSRF token to headers
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true,  // Allow cookies to be sent
                }
            );

            console.log('Login successful:', response.data);
            // Handle successful login here (e.g., redirect or save user data)
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;