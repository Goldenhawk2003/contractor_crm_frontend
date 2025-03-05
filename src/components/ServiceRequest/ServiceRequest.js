import React, { useState } from 'react';
import './ServiceRequest.css';
import axios from 'axios';

// Function to get CSRF token from cookies
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

// Add CSRF token to axios requests dynamically
axios.interceptors.request.use((config) => {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
}, (error) => Promise.reject(error));

const ServiceRequest = () => {
    const [searchText, setSearchText] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit(); // Submit form on Enter key press
        }
    };

    const handleSubmit = async () => {
        if (!searchText.trim()) {
            setErrorMessage('Please enter a valid service request.');
            return;
        }

        try {
            const response = await axios.post(
                'https://ecc-backend-8684636373f0.herokuapp.comapi/request-service/',
                { searchText },
                { withCredentials: true }
            );
            setSuccessMessage('Your request has been submitted successfully!');
            setErrorMessage(null); // Clear any existing error messages
            setSearchText(''); // Clear the input field
            console.log('Response:', response.data);
        } catch (error) {
            setErrorMessage('Failed to submit the request. Please try again later.');
            setSuccessMessage(null); // Clear success message
            console.error('Error submitting request:', error);
        }
    };

    return (
        <div className="main">
            <h1>Request a Service</h1>
            <p>If you require a service not listed in our directory, please use the form below to submit your request:</p>
            
            <div className="form">
                <input
                    type="text"
                    placeholder="I need snow removal services for the winter season"
                    className="box"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button
                    type="button"
                    className="submit"
                    onClick={handleSubmit}
                    disabled={!searchText.trim()} // Disable button if input is empty
                >
                    Submit Form
                </button>
            </div>

            {/* Success Message */}
            {successMessage && <p className="success-message">{successMessage}</p>}

            {/* Error Message */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default ServiceRequest;