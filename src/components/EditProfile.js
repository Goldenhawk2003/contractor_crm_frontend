import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfilePage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        location: '',
        profession: '',
        logo: null,
        job_type: '',
        experience_years: '',
        rating: '',
        profile_description: '',
        hourly_rate: '',
        picture: null,
        phone_number: '',
        address: '',
        company_name: '',
    });
    const [userType, setUserType] = useState('');

    useEffect(() => {
        // Fetch user type on component mount
        axios.get('/api/user_profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) => {
            setUserType(response.data.user_type);
        })
        .catch((error) => {
            console.error('Error fetching user profile:', error);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async () => {
        const config = {
            headers: { 
                'Content-Type': 'multipart/form-data', 
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            },
        };
        const form = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key]) form.append(key, formData[key]);
        });
        try {
            await axios.put('/api/edit_profile', form, config);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Error updating profile');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Edit Profile</h2>
            {['username', 'email', 'location', 'profession'].map((field) => (
                <div key={field} style={{ marginBottom: '10px' }}>
                    <label>{field.replace('_', ' ').toUpperCase()}</label>
                    <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
            ))}
            <div style={{ marginBottom: '10px' }}>
                <label>LOGO</label>
                <input
                    type="file"
                    name="logo"
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ddd' }}
                />
            </div>

            {userType === 'professional' && (
                <>
                    {['job_type', 'experience_years', 'rating', 'profile_description', 'hourly_rate'].map((field) => (
                        <div key={field} style={{ marginBottom: '10px' }}>
                            <label>{field.replace('_', ' ').toUpperCase()}</label>
                            <input
                                type="text"
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </div>
                    ))}
                    <div style={{ marginBottom: '10px' }}>
                        <label>PICTURE</label>
                        <input
                            type="file"
                            name="picture"
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                    </div>
                </>
            )}

            {userType === 'client' && (
                <>
                    {['phone_number', 'address', 'company_name'].map((field) => (
                        <div key={field} style={{ marginBottom: '10px' }}>
                            <label>{field.replace('_', ' ').toUpperCase()}</label>
                            <input
                                type="text"
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </div>
                    ))}
                </>
            )}

            <button onClick={handleSubmit} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
                Save Changes
            </button>
        </div>
    );
};

export default EditProfilePage;