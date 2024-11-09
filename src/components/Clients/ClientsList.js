import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Clients.css';

const ClientsList = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Placeholder for API call to fetch clients
    // Example: fetchClients();
  }, []);

  return (
    <div className="clients-list">
      <h2>Clients</h2>
      {clients.length > 0 ? (
        <ul>
          {clients.map((client) => (
            <li key={client.id}>
              <Link to={`/clients/${client.id}`}>{client.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No clients found</p>
      )}
    </div>
  );
};

export default ClientsList;