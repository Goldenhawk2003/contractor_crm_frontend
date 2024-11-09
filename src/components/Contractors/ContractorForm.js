import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Contractors.css';

const ContractorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractorData, setContractorData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (id) {
      // Placeholder for API call to fetch contractor data if editing
      // Example: fetchContractor(id);
      // Populate the form with the fetched data
    }
  }, [id]);

  const handleChange = (e) => {
    setContractorData({ ...contractorData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for API call to create or update contractor data
    navigate('/contractors');
  };

  return (
    <div className="contractor-form">
      <h2>{id ? 'Edit Contractor' : 'Add Contractor'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={contractorData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={contractorData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="tel"
          name="phone"
          value={contractorData.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <input
          type="text"
          name="address"
          value={contractorData.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <button type="submit">{id ? 'Update' : 'Add'} Contractor</button>
      </form>
    </div>
  );
};

export default ContractorForm;