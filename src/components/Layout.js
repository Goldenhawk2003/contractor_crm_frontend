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
                src={`${process.env.PUBLIC_URL}/images/logos/26EFE61E-E17F-4F73-8586-A5346B7E5A51.png`}
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
      <div className={`sidebar-layout ${sidebarOpen ? "open" : ""}`}>
        <button className="close-button" onClick={() => setSidebarOpen(false)}>
          ✖
        </button>
        <nav className="sidebar-layout-menu">
          {isSuperUser && <Link to="/dashboard" className="sidebar-layout-item">Dashboard</Link>}
          <Link to="/" className="sidebar-layout-item">Home</Link>
          <Link to="/AboutUs" className="sidebar-layout-item">About Us</Link>
          <Link to="/Browse-contractors" className="sidebar-layout-item">Services</Link>
          <Link to="/contact" className="sidebar-layout-item">Contact Us</Link>
          <Link to="/user-profile" className="sidebar-layout-item">User Profile</Link>
          {!isAuthenticated ? (
            <Link to="/login" className="sidebar-layout-item">Login</Link>
          ) : (
            <button onClick={logout} className="sidebar-layout-item">Logout</button>
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