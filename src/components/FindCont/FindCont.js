import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './FIndCont.css';

const FindCont = () => {
    const [workType, setWorkType] = useState(''); // Track selected work type
    const [contractors, setContractors] = useState([]); // Store fetched contractors
    const [error, setError] = useState(''); // Track errors
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`Selected work type: ${workType}`);

        if (workType === 'Other') {
            navigate('/Quiz'); // Redirect to a different page for "Other"
        } else {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve token from storage
                const response = await fetch(`http://localhost:8000/api/contractors/?job_type=${workType}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Failed to fetch contractors: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched contractors:', data);
                setContractors(data);
                setError('');
            } catch (err) {
                console.error('Error fetching contractors:', err);
                setError('Could not fetch contractors. Please try again later.');
            }
        }
    };

    return (
        <div className="find-cont">
        <h1 className="title">Find A Contractor</h1>
        <p className="subtitle">Select the type of work you need from the dropdown menu below.</p>
        <form onSubmit={handleSubmit} className="form">
            <select
                className="dropdown"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
            >
                <option value="" disabled>Select a service</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Painting">Painting</option>
                <option value="Other">Other</option>
            </select>
            <button type="submit" disabled={!workType} className="submit-btn">
                Submit
            </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {contractors.length > 0 && (
            <div className="contractor-list">
                <h2>Available Contractors</h2>
                <ul>
                    {contractors.map((contractor) => (
                        <li key={contractor.id} className="contractor-card">
                           <Link to={`/contractor/${contractor.id}`} className="contractor-link">
                                    <p><strong>Username:</strong> {contractor.username || contractor.name}</p>
                                </Link>
                            <p><strong>Job Type:</strong> {contractor.job_type}</p>
                            <p><strong>Experience:</strong> {contractor.experience_years} years</p>
                            <p><strong>Rating:</strong> {contractor.rating}</p>
                            <p><strong>Description:</strong> {contractor.profile_description || 'No description provided'}</p>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
    );
};

export default FindCont;