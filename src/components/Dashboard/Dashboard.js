import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const api = require('../../api').default;

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null); // for error handling

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token'); // Ensure token is retrieved
        const response = await api.get('/dashboard/', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        });
        setData(response.data); // Set the data to state
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load dashboard data'); // Set error message in case of failure
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      {error && <p className="error">{error}</p>} {/* Display error message if any */}

      {data ? (
        <div>
          <h2>Summary</h2>
          <ul>
            <li>Total Contractors: {data.total_contractors}</li>
            <li>Total Clients: {data.total_clients}</li>
            <li>Outstanding Invoices: {data.outstanding_invoices}</li>
            <li>Paid Invoices: {data.paid_invoices}</li>
          </ul>

          {/* Assuming you also want to show form responses */}
          <h2>Form Responses</h2>
          {data.form_responses && data.form_responses.length > 0 ? (
            <ul>
              {data.form_responses.map((response, index) => (
                <li key={index}>
                  <strong>Response {index + 1}:</strong> {response.response}
                </li>
              ))}
            </ul>
          ) : (
            <p>No form responses available.</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {/* Example link to another page */}
      <Link to="/another-page">Go to another page</Link>
    </div>
  );
};

export default Dashboard;