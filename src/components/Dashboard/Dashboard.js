import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null); // State to store dashboard data
  const [error, setError] = useState(null); // State for error handling
  const [isLoading, setIsLoading] = useState(true); // State to track loading

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:8000/dashboard/', {
          method: 'GET',
          credentials: 'include', // Include session cookies in the request
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Dashboard data:', responseData);
        setData(responseData); // Set the fetched data in state
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      {/* Display error if any */}
      {error && <p className="error">{error}</p>}

      {/* Display loading state */}
      {isLoading && <p>Loading...</p>}

      {/* Render dashboard data when available */}
      {!isLoading && data && (
        <div>
          <h2>Summary</h2>
          <ul>
            <li>Total Contractors: {data.total_contractors}</li>
            <li>Total Clients: {data.total_clients}</li>
            <li>Outstanding Invoices: {data.outstanding_invoices}</li>
            <li>Paid Invoices: {data.paid_invoices}</li>
          </ul>

          <h2>Form Responses</h2>
          {data.form_responses && data.form_responses.length > 0 ? (
            <ul>
              {data.form_responses.map((response, index) => (
                <li key={index}>
                  <strong>Response {index + 1}:</strong> {response.answer} (Quiz: {response.quiz})
                </li>
              ))}
            </ul>
          ) : (
            <p>No form responses available.</p>
          )}
        </div>
      )}

      {/* Render a fallback if no data is available */}
      {!isLoading && !data && <p>No dashboard data available.</p>}

      {/* Navigation link */}
      <Link to="/" className="dashboard-link">
        Go to another page
      </Link>
    </div>
  );
};

export default Dashboard;