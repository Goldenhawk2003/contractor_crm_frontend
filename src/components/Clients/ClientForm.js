import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Clients.css';

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (id) {
      // Placeholder for API call to fetch client data if editing
      // Example: fetchClient(id);
      // Populate the form with the fetched data
    }
  }, [id]);

  const handleChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for API call to create or update client data
    navigate('/clients');
  };

  return (
    <div className="client-form">
      <h2>{id ? 'Edit Client' : 'Add Client'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={clientData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={clientData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="tel"
          name="phone"
          value={clientData.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <input
          type="text"
          name="address"
          value={clientData.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <button type="submit">{id ? 'Update' : 'Add'} Client</button>
      </form>
    </div>
  );
};

export default ClientForm;