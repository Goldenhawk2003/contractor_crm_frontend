import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:8000/dashboard/', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard: ${response.status}`);
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <p>Welcome back, <strong>Admin</strong>!</p>
        <button className="logout-btn">Logout</button>
      </header>

      {/* Loading State */}
      {isLoading && <p className="loading-message">Loading...</p>}

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Main Content */}
      {!isLoading && data && (
        <div className="dashboard-content">
          {/* Key Metrics */}
          <section className="metrics">
            <h2>Key Metrics</h2>
            <div className="metric-cards">
              {[
                { title: "Total Contractors", value: data.total_contractors },
                { title: "Total Clients", value: data.total_clients },
                { title: "Outstanding Invoices", value: data.outstanding_invoices },
                { title: "Paid Invoices", value: data.paid_invoices },
              ].map((metric, index) => (
                <div key={index} className="card">
                  <h3>{metric.title}</h3>
                  <p>{metric.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Service Requests */}
          <section className="service-requests">
            <h2>Recent Service Requests</h2>
            {data.recent_service_requests && data.recent_service_requests.length > 0 ? (
              <ul className="service-requests-list">
                {data.recent_service_requests.map((request) => (
                  <li key={request.id} className="service-request-item">
                    <p><strong>User:</strong> {request.user}</p>
                    <p><strong>Request:</strong> {request.request}</p>
                    <p><strong>Created At:</strong> {request.created_at}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent service requests available.</p>
            )}
          </section>

          {/* Visualizations */}
          <section className="charts">
            <h2>Visualizations</h2>
            <div className="chart-container">
              <div className="chart">
                <p>Pie Chart Placeholder: Invoice Status</p>
              </div>
              <div className="chart">
                <p>Line Chart Placeholder: User Growth</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Fallback */}
      {!isLoading && !data && <p>No dashboard data available.</p>}
    </div>
  );
};

export default Dashboard;