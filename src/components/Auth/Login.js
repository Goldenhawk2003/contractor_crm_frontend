import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            // Send the POST request to the login endpoint
            const response = await axios.post(
                'http://localhost:8000/api/login/',  // Your Django API endpoint
                { username, password },
                { withCredentials: true }  // Ensure credentials are sent with the request
            );

            // If login is successful, handle the response
            console.log('Login successful:', response.data);
            // Redirect the user or show a success message
        } catch (error) {
            // Handle errors (invalid credentials, etc.)
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