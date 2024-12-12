import React, { useState } from 'react';
import './ServiceRequest.css';
import axios from 'axios';

const getCSRFToken = () => {
    const name = "csrftoken";
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1);
        }
    }
    console.error("CSRF token not found");
    return null;
};

axios.defaults.headers.common["X-CSRFToken"] = getCSRFToken();

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
            

            const response = await axios.post(
                'http://localhost:8000/api/request-service/',
                { searchText },
                {
                    withCredentials: true,
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