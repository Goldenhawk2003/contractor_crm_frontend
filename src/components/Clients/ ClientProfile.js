import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Clients.css';

const ClientProfile = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    // Placeholder for API call to fetch client details
    // Example: fetchClient(id);
  }, [id]);

  if (!client) return <p>Loading client details...</p>;

  return (
    <div className="client-profile">
      <h2>{client.name}</h2>
      <p>Email: {client.email}</p>
      <p>Phone: {client.phone}</p>
      <p>Address: {client.address}</p>
      {/* Add more fields as needed */}
      <Link to={`/clients/edit/${client.id}`}>Edit Client</Link>
    </div>
  );
};

export default ClientProfile;