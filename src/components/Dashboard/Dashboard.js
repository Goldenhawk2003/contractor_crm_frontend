import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    clients: 0,
    contractors: 0,
    contracts: 0,
    invoices: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Placeholder for API calls to fetch metrics and recent activities
    // Example:
    // fetchMetrics();
    // fetchRecentActivities();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      {/* Metrics Overview */}
      <div className="metrics">
        <div className="metric-box">
          <h2>Clients</h2>
          <p>{metrics.clients}</p>
        </div>
        <div className="metric-box">
          <h2>Contractors</h2>
          <p>{metrics.contractors}</p>
        </div>
        <div className="metric-box">
          <h2>Contracts</h2>
          <p>{metrics.contracts}</p>
        </div>
        <div className="metric-box">
          <h2>Invoices</h2>
          <p>{metrics.invoices}</p>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="recent-activities">
        <h2>Recent Activities</h2>
        <ul>
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))
          ) : (
            <p>No recent activities</p>
          )}
        </ul>
      </div>
      <div className='nav-buttons'>
      <Link to="/Clients/ClientsList" className="nav-button" >ClientsList</Link>

      <Link to="/Contractors/ContractorsList" className="nav-button" >ContractorList</Link>
      </div>
    </div>
  );
};

export default Dashboard;


