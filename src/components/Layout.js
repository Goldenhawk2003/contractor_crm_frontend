import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';
import "./Layout.css";

const Layout = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div>
      <header>
        <nav className="button-group">
          <Link to="/" className="nav-button" >Home</Link>
          <Link to="/become-a-contractor" className="nav-button" >Become a Contractor</Link>
          <Link to="/jobs" className="nav-button" >Jobs</Link>
          <Link to="/contact" className="nav-button">Contact us</Link>
          {!isAuthenticated ? (
            <Link to="/login" style={{ float: 'right' }} className="log-button">Login/Signup</Link>
          ) : (
            <button onClick={logout} style={{ float: 'right' }}>Logout</button>
          )}
        </nav>
      </header>
      <main>
        <Outlet /> {/* This renders the child route component */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;