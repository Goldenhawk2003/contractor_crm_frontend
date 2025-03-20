import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';
import './Layout.css';

const Layout = () => {
  const { isAuthenticated, authLoaded, user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <nav className="nav-container">
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
              className="hamburger-button"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
          </div>
        </nav>
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-button" onClick={() => setSidebarOpen(false)}>
          ✖
        </button>
        <nav className="sidebar-menu">
          {isSuperUser && <Link to="/dashboard" className="sidebar-item">Dashboard</Link>}
          <Link to="/AboutUs" className="sidebar-item">About Us</Link>
          <Link to="/Browse-contractors" className="sidebar-item">Services</Link>
          <Link to="/contact" className="sidebar-item">Contact Us</Link>
          <Link to="/user-profile" className="sidebar-item">User Profile</Link>
          {!isAuthenticated ? (
            <Link to="/login" className="sidebar-item">Login</Link>
          ) : (
            <button onClick={logout} className="sidebar-item">Logout</button>
          )}
        </nav>
      </div>

      {/* Dark overlay when sidebar is open */}
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}

      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;