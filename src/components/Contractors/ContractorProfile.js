import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Contractors.css';

const ContractorProfile = () => {
  const { id } = useParams();
  const [contractor, setContractor] = useState(null);
  const [error, setError] = useState(''); // Error handling state

  useEffect(() => {
    const fetchContractor = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/contractors/${id}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch contractor details');
        }
        const data = await response.json();
        setContractor(data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Could not fetch contractor details. Please try again later.');
      }
    };

    fetchContractor();
  }, [id]);

  if (error) return <p className="error-message">{error}</p>;
  if (!contractor) return <p>Loading contractor details...</p>;

  return (
    <div className="contractor-profile">
      <h2 className="contractor-name">{contractor.username || contractor.name}</h2>
      <p><strong>Location:</strong> {contractor.location || 'N/A'}</p>
      <p><strong>Job Type:</strong> {contractor.job_type}</p>
      <p><strong>Experience:</strong> {contractor.experience_years} years</p>
      <p><strong>Rating:</strong> {contractor.rating || 'No ratings yet'}</p>
      <p><strong>Description:</strong> {contractor.profile_description || 'No description provided'}</p>
      {/* Add any additional fields */}
      {/* <Link to={`/contractors/edit/${contractor.id}`} className="edit-link">Edit Contractor</Link> */}
    </div>
  );
};

export default ContractorProfile;