import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const getCSRFToken = () => {
  const name = "csrftoken";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(`${name}=`)) {
          return cookie.substring(name.length + 1);
      }
  }
  console.error("CSRF token not found");
  return null;
};
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleApprove = async (id) => {
    try {
        const response = await fetch(`http://localhost:8000/api/approve-contractor/${id}/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
        });

        if (!response.ok) {
            throw new Error('Failed to approve contractor.');
        }

        alert('Contractor approved successfully!');
        fetchDashboard(); // Refresh data
    } catch (error) {
        alert('Error approving contractor. Please try again.');
    }
};
const handleReject = async (id) => {
  try {
      const response = await fetch(`http://localhost:8000/api/reject-contractor/${id}/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCSRFToken(),
          },
      });

      if (!response.ok) {
          throw new Error('Failed to reject contractor.');
      }

      alert('Contractor rejected successfully!');
      fetchDashboard(); // Refresh the data
  } catch (error) {
      alert('Error rejecting contractor. Please try again.');
  }
};

  useEffect(() => {
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

          {/* Pending Registrations */}
          <section className="pending-applications">
            <h2>Pending Contractor Applications</h2>
            {data.pending_applications && data.pending_applications.length > 0 ? (
              <ul className="pending-list">
                {data.pending_applications.map((app) => (
                  <li key={app.id} className="application-item">
                    <p><strong>Username:</strong> {app.username}</p>
                    <p><strong>Job Type:</strong> {app.job_type}</p>
                    <p><strong>Location:</strong> {app.location}</p>
                    <img
  src={
    app.logo && app.logo.startsWith('http')
      ? app.logo
      : `http://localhost:8000${app.logo}`
  }
  alt={`${app.username}'s logo`}
  className="application-logo"
/>
                    <div className="application-buttons">
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(app.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(app.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pending applications.</p>
            )}
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
        </div>
      )}

      {/* Fallback */}
      {!isLoading && !data && <p>No dashboard data available.</p>}
    </div>
  );
};

export default Dashboard;