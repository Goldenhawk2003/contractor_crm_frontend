import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';
import './Layout.css';

const Layout = () => {
  const { isAuthenticated, authLoaded, user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();


  useEffect(() => {
    console.log("Auth state changed: ", isAuthenticated);
  }, [isAuthenticated]);

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
  const logoMap = {
    '/': 'ETNdark2-08.png',
    '/dashboard': 'darketn-07.png',
    '/quiz': 'darketn-07.png',
    '/login': 'darketn-07.png',
    '/signup':  'darketn-07.png', 
    '/Tutorials': 'darketn-07.png',
    '/upload':  'darketn-07.png',
    '/video-player': 'darketn-07.png',
    '/blogs':'darketn-07.png',
   
    '/user-profile': 'ETNdark2-08.png',
  };

  // Grab the right logo or fallback
  const logoFile = logoMap[location.pathname] || 'darketn-07.png';

  const logoSrc = `${process.env.PUBLIC_URL}/images/logos/logos-header/${logoFile}`;



  return (
    <div className="layout-container">
      <header className="layout-header">
        <nav className="nav-container">
          <div className="left-nav">
            <Link to="/" className="logo-link">
              <img
                src={logoSrc}
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
          <Link to="blogs" className='sidebar-layout-item'>Blog</Link>
          <Link to="/AboutUs" className="sidebar-layout-item">About Us</Link>
          <Link to="/Tutorials" className="sidebar-layout-item">Inspiration</Link>
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