import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfilePage = () => {
    const [profileData, setProfileData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        axios.get('/api/profile/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then((response) => {
            setProfileData(response.data);
            setIsLoading(false);
        })
        .catch((error) => {
            setMessage('Failed to load profile data.');
            setIsLoading(false);
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleSubmit = () => {
        axios.put('/api/profile/', profileData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then((response) => {
            setMessage('Profile updated successfully!');
        })
        .catch((error) => {
            setMessage('Failed to update profile.');
        });
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            {message && <p className="mb-2">{message}</p>}
            <Card>
                <CardContent>
                    {Object.keys(profileData).map((key) => (
                        <div key={key} className="mb-3">
                            <label className="block text-sm font-medium">{key}</label>
                            <Input
                                name={key}
                                value={profileData[key] || ''}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                    ))}
                    <Button onClick={handleSubmit} className="mt-4">Save Changes</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditProfilePage;
