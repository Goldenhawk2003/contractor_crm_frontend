import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';



const api = require('../../api').default;


const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/dashboard/'); // Ensure this is the correct endpoint
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {data ? (
        <ul>
          <li>Total Contractors: {data.total_contractors}</li>
          <li>Total Clients: {data.total_clients}</li>
          <li>Outstanding Invoices: {data.outstanding_invoices}</li>
          <li>Paid Invoices: {data.paid_invoices}</li>
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;


