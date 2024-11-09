import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Contractors.css';

const ContractorProfile = () => {
  const { id } = useParams();
  const [contractor, setContractor] = useState(null);

  useEffect(() => {
    // Placeholder for API call to fetch contractor details
    // Example: fetchContractor(id);
  }, [id]);

  if (!contractor) return <p>Loading contractor details...</p>;

  return (
    <div className="contractor-profile">
      <h2>{contractor.name}</h2>
      <p>Email: {contractor.email}</p>
      <p>Phone: {contractor.phone}</p>
      <p>Address: {contractor.address}</p>
      {/* Add more fields as needed */}
      <Link to={`/contractors/edit/${contractor.id}`}>Edit Contractor</Link>
    </div>
  );
};

export default ContractorProfile;