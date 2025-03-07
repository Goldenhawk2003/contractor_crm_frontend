import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';
import axios from 'axios';
import './Layout.css';

const Layout = () => {
  const { isAuthenticated, authLoaded, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Instead of a separate call, use the `user` from AuthContext to determine superuser status.
  const isSuperUser = user?.is_superuser || false;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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