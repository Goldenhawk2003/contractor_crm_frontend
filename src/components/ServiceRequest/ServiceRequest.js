import React, { useState } from 'react';
import './ServiceRequest.css';
import axios from 'axios';

const ServiceRequest = () => {
    const [searchText, setSearchText] = useState('');
    
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            setSearchText('');
        }
    };

    const handleSubmit = async () => {
        try {
            // Retrieve the token from local storage
            const token = localStorage.getItem('accessToken');
            
            // Check if the token exists
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }

            const response = await axios.post(
                'http://localhost:8000/api/request-service/',
                { searchText },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Use the dynamic token here
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error submitting request:', error);
        }
    };

    return (
        <div className="main">
            <h1>Request a Service</h1>
            <p>If you require a service not listed in our directory please use the form below to submit your request</p>
            <div className="form">
                <input
                    type="text"
                    placeholder="I need snow removal services for the winter season"
                    className="box"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button type="button" className="submit" onClick={handleSubmit}>
                    Submit Form
                </button>
            </div>
        </div>
    );
};

export default ServiceRequest;