import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';
import './Layout.css';

const Layout = () => {
  const { isAuthenticated, authLoaded, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Log the user object and superuser check
  useEffect(() => {
    console.log("Current user:", user);
    if (user) {
      console.log("User is superuser:", user.is_superuser);
    }
  }, [user]);

  const isSuperUser = user?.is_superuser || false;

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
            <button 
              className="nav-button dropdown-toggle" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Menu ▼
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {isSuperUser && <Link to="/dashboard" className="dropdown-item">Dashboard</Link>}
                <Link to="/AboutUs" className="dropdown-item">About Us</Link>
                <Link to="/Browse-contractors" className="dropdown-item">Services</Link>
                <Link to="/contact" className="dropdown-item">Contact Us</Link>
                <Link to="/user-profile" className="dropdown-item">User Profile</Link>
                {!isAuthenticated ? (
                  <Link to="/login" className="dropdown-item">Login</Link>
                ) : (
                  <button onClick={logout} className="dropdown-item">Logout</button>
                )}
              </div>
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