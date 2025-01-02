import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './FIndCont.css';

const FindCont = () => {
    const [workType, setWorkType] = useState('');
    const [contractors, setContractors] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        // Get workType from query parameter or state
        const typeFromQuery = searchParams.get('type');
        const typeFromState = location.state?.query;

        if (typeFromQuery) {
            setWorkType(typeFromQuery);
            fetchContractors(typeFromQuery);
        } else if (typeFromState) {
            setWorkType(typeFromState);
            fetchContractors(typeFromState);
        }
    }, [searchParams, location.state]);

    const fetchContractors = async (type) => {
        if (type === 'Other') {
            navigate('/Quiz');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:8000/api/contractors/?job_type=${type}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : undefined,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch contractors: ${response.status}`);
            }

            const data = await response.json();
            setContractors(data);
            setError('');
        } catch (err) {
            console.error('Error fetching contractors:', err);
            setError('Could not fetch contractors. Please try again later.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetchContractors(workType);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < rating ? 'star filled' : 'star'}>
                    ★
                </span>
            );
        }
        return stars;
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
                    <option value="Snow-removal">Snow Removal</option>
                    <option value="Renovations">Renovation</option>
                </select>
                <button type="submit" disabled={!workType} className="submit-btn">
                    Submit
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {contractors.length > 0 ? (
                <div className="contractor-list">
                    <div style={{ width: '100%', display: 'block', marginBottom: '20px' }}>
                        <h2>Available Contractors</h2>
                    </div>
                    <ul>
                        {contractors.map((contractor) => (
                            <li key={contractor.id} className="contractor-card">
                                <Link to={`/contractor/${contractor.id}`} className="contractor-link">
                                    <p><strong>Username:</strong> {contractor.username || 'Unknown'}</p>
                                </Link>
                                <p><strong>Job Type:</strong> {contractor.job_type || 'N/A'}</p>
                                <p><strong>Experience:</strong> {contractor.experience_years || 'N/A'} years</p>
                                <p><strong>Rating:</strong> {renderStars(contractor.rating)}</p>
                                <p><strong>Description:</strong> {contractor.profile_description || 'No description provided'}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                !error && workType && (
                    <p className="no-contractors-message">
                        No contractors available for the selected service.
                    </p>
                )
            )}
        </div>
    );
};

export default FindCont;