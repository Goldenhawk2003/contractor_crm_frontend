import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';
import axios from 'axios';
import './Layout.css';

const Layout = () => {
  // Destructure auth state, including authLoaded and isAuthenticated
  const { isAuthenticated, authLoaded, logout } = useAuth();
  const navigate = useNavigate();
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // If using token-based auth, get token from localStorage
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user-info-superuser/`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );
  
        // Check if the user is a superuser
        if (response.data.is_superuser) {
          setIsSuperUser(true);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
  
    // Fetch user info only if the user is authenticated
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Function to check screen size
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust threshold as needed
    };

    // Initial check and add event listener
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Render a loading state until auth check is complete
  if (!authLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="layout-container">
      <header className="layout-header">
        <nav className="button-group">
          <div className="left-nav">
            <Link to="/" className="logo-link">
              <img
                src={`${process.env.PUBLIC_URL}/images/EC_Primary_White.png`}
                alt="Logo"
                className="nav-logo"
                height="50px"
              />
            </Link>
          </div>
          <div className="right-nav">
            {isSuperUser && (
              <Link to="/dashboard" className="nav-button">Dashboard</Link>
            )}
            <Link to="/AboutUs" className="nav-button">About Us</Link>
            <Link to="/Browse-contractors" className="nav-button">Services</Link>
            <Link to="/contact" className="nav-button">Contact Us</Link>
            <Link to="/user-profile" className="nav-button">User Profile</Link>
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