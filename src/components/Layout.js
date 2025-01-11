import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';
import axios from 'axios'; // Ensure axios is imported
import './Layout.css';

const Layout = () => {
  const { isAuthenticated, logout } = useAuth(); // Ensure setIsAuthenticated is available from context
  const navigate = useNavigate(); // For redirecting after logout
  const [isSuperUser, setIsSuperUser] = useState(false); // State to track superuser status

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user-info-superuser/', {
          withCredentials: true, // Ensures cookies are sent
        });

        // Check if the user is a superuser
        if (response.data.is_superuser) {
          setIsSuperUser(true);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    // Fetch user info if authenticated
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated]);

  return (
    <div className="layout-container">
      <header className="layout-header">
        <nav className="button-group">
          <div className="left-nav">
            <Link to="/" className="nav-button">Home</Link>
            {isSuperUser && (
              <Link to="/dashboard" className="nav-button">Dashboard</Link>
            )}
            <Link to="/inbox" className="nav-button">Chat</Link>
            <Link to="/Inbox2" className="nav-button">Chat2</Link>
            <Link to="/Inbox3" className="nav-button">Chat3</Link>
            <Link to="/contact" className="nav-button">Contact Us</Link>
            <Link to="/user-profile" className="nav-button">User Profile</Link>
          </div>

          <div className="right-nav">
            <Link to="/" className="logo-link">
              <img
                src={`${process.env.PUBLIC_URL}/images/IMG_2582.PNG`}
                alt="Logo"
                className="nav-logo"
                height="50px"
              />
            </Link>
            {!isAuthenticated ? (
              <Link to="/login" className="nav-button">Login</Link>
            ) : (
              <button onClick={logout} className="nav-button">Logout</button>
            )}
          </div>
        </nav>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;