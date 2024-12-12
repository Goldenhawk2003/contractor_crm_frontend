import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./Browse.css";

const Browse = () => {
    const [workType, setWorkType] = useState('');
    const [location, setLocation] = useState('');
    const [contractors, setContractors] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`Selected work type: ${workType}, Selected location: ${location}`);

        if (workType === 'Other') {
            navigate('/Quiz');
        } else {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/contractors/?job_type=${workType}&location=${location}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
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

    // Function to render star ratings
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < rating ? "star filled" : "star"}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="page">
            <div className="filters">
                <form onSubmit={handleSubmit} className="form">
                    <span className="para">I’m looking for</span>
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
                    <span className="para">near</span>
                    <select
                        className="dropdown"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    >
                        <option value="" disabled>Select a location</option>
                        <option value="Ajax">Ajax</option>
                        <option value="Durham">Durham</option>
                        <option value="Toronto">Toronto</option>
                        <option value="Markham">Markham</option>
                    </select>
                    <button type="submit" disabled={!workType || !location} className="submit-btn">
                        GO!
                    </button>
                </form>
            </div>
            <div className="Contractors">
                <h2>Best Matches For You</h2>
                <p className="cont-p">Lorem ipsum text for additional context and details about contractors.</p>
                <p>
                    PSST! Average Pricing based on our algorithm is ${} for a {}
                </p>
                {contractors.length > 0 ? (
                    <div className="contractor-list">
                        {contractors.map((contractor) => (
                            <div key={contractor.id} className="contractor-card">
                                <Link to={`/contractor/${contractor.id}`} className="contractor-link">
                                    <p>
                                        <strong>Username:</strong> {contractor.username || contractor.name}
                                    </p>
                                </Link>
                                <p>
                                    <strong>Job Type:</strong> {contractor.job_type}
                                </p>
                                <p>
                                    <strong>Experience:</strong> {contractor.experience_years} years
                                </p>
                                <p>
                                    <strong>Rating:</strong> <span className="stars">{renderStars(contractor.rating)}</span>
                                </p>
                                <p>
                                    <strong>Description:</strong>{' '}
                                    {contractor.profile_description || 'No description provided'}
                                </p>
                                <p>
                                    <strong>Location:</strong> {contractor.location}
                                </p>
                                <p>
                                    <strong>Hourly Rate: $</strong>{contractor.hourly_rate}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No contractors found for the selected criteria.</p>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default Browse;