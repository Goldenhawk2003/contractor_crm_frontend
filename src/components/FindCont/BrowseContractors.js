import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./Browse.css";

const Browse = () => {
    const [workType, setWorkType] = useState('');
    const [location, setLocation] = useState('');
    const [hourlyRateRange, setHourlyRateRange] = useState(''); // Dropdown for hourly rate range
    const [contractors, setContractors] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`Filters: WorkType=${workType}, Location=${location}, HourlyRateRange=${hourlyRateRange}`);
    
        if (workType === 'Other') {
            navigate('/Quiz');
        } else {
            setIsLoading(true); // Start loading state
            try {
                const queryParams = new URLSearchParams({
                    job_type: workType,
                    location: location,
                });

                const maxRate = hourlyRateRange ? parseInt(hourlyRateRange.split('-')[1], 10) : null;
                const minRate = hourlyRateRange ? parseInt(hourlyRateRange.split('-')[0], 10) : null;
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/api/contractors/?${queryParams.toString()}`,
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

                let data = await response.json();
                console.log('Fetched contractors:', data);

                // Apply hourly rate filter if a range is selected
                if (minRate != null && maxRate !== null) {
                    
                    data = data.filter((contractor) =>   minRate <= contractor.hourly_rate && contractor.hourly_rate <= maxRate);

                    console.log('Filtered contractors by hourly rate:', data);
                }

                setContractors(data);
                setError('');
            } catch (err) {
                console.error('Error fetching contractors:', err);
                setError('Could not fetch contractors. Please try again later.');
            } finally {
                setIsLoading(false); // Stop loading state
            }
        }
    };

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

    useEffect(() => {
        console.log("Current contractors data:", contractors);
    }, [contractors]);

    return (
        <div className="page">
            <div className="browse-gold">
            <p className='browse-header'> Customize your search to begin browsing contractors.</p>
            </div>
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
                    <span className="para">with hourly rate</span>
                    <select
                        className="dropdown"
                        value={hourlyRateRange}
                        onChange={(e) => setHourlyRateRange(e.target.value)}
                    >
                        <option value="">Select a range (Optional)</option>
                        <option value="0-100">0-100</option>
                        <option value="100-200">100-200</option>
                        <option value="200-300">200-300</option>
                        <option value="300-500">300-500</option>
                        <option value="500+">500+</option>
                    </select>
                    <button type="submit" disabled={!workType || !location} className="submit-btn">
                        GO!
                    </button>
                </form>
            </div>
            <div className="Contractors">
                
                {isLoading ? (
                    <p>Loading contractors...</p>
                ) : contractors.length > 0 ? (<div> 
                    <h2 className='browse-header'>Best Matches For You</h2>
                    <div className="contractor-list">

                    {contractors.map((contractor) => (
    <li key={contractor.id} className="contractor-card-prof">
        <Link to={`/contractor/${contractor.id}`} className="contractor-link-prof">
            {contractor.logo && (
                <img
                    src={contractor.logo || '/placeholder.png'}
                    alt={`${contractor.username || contractor.name} Logo`}
                    className="contractor-logo-prof"
                />
            )}
        </Link>
        
        <div className="contractor-info-prof">
        <div className="contractor-details-prof">
            <h3 className="contractor-name-prof">{contractor.username || 'Unknown'}</h3>
            <p className="contractor-stars-prof">{renderStars(contractor.rating)}</p>
            </div>
            <div className="contractor-details-prof">
                <p>{contractor.job_type || 'N/A'}</p>
                <p className="contractor-rating-prof">{contractor.rating || '0'}/5</p>
            </div>
           
        </div>
    </li>
))}
                    </div>
                    </div>
                ) : (
                    <p className='first-text'>
                    </p>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default Browse;