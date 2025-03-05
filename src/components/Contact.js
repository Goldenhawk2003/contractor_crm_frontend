import React, { useState, useEffect } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        message: '',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/contact/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to send your message. Please try again.');
            }

            setSuccessMessage('Thank you for contacting us! We will get back to you soon.');
            setFormData({ first_name: '', last_name: '', email: '', message: '' });
        } catch (error) {
            console.error(error);
            setErrorMessage('Something went wrong. Please try again later.');
        }
    };
    useEffect(() => {
        // Add a class to the body for this specific page
        document.body.classList.add("page");
    
        // Clean up by removing the class when the component is unmounted
        return () => {
          document.body.classList.remove("page");
        };
      }, []);
    

    return (
        <div>
            <h1 className="contact-header">Contact Us</h1>
            <p className='contact-p'>Need assistance? Our team is here to help. Please fill out the form below, and we will be in contact with you as soon as we can.</p>
            <div className="contact">
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <form onSubmit={handleSubmit} className="contact-form">
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                        />
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                        />
                    </div>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    <select name="role" className="dropdown" onChange={handleChange} required>
                        <option value="">I am a...</option>
                        <option value="Elite Contractor">Elite Contractor</option>
                        <option value="Homeowner">Homeowner</option>
                        
                    </select>
                    
                    <textarea
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                    ></textarea>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;