import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Contractors.css';

const ContractorsList = () => {
  const [contractors, setContractors] = useState([]);

  useEffect(() => {
    // Placeholder for API call to fetch contractors
    // Example: fetchContractors();
  }, []);

  return (
    <div className="contractors-list">
      <h2>Contractors</h2>
      {contractors.length > 0 ? (
        <ul>
          {contractors.map((contractor) => (
            <li key={contractor.id}>
              <Link to={`/contractors/${contractor.id}`}>{contractor.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No contractors found</p>
      )}
    </div>
  );
};

export default ContractorsList;