import {React, useState} from 'react';
import { Link, Outlet} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';
import "./Layout.css";

const Layout = () => {
  const { isAuthenticated, logout } = useAuth();
  const [contractor, setContractor] = useState(null);

  return (
    <div>
      <header>
        <nav className="button-group">
          <div className="left-nav">
            <Link to="/" className="nav-button">Home</Link>
            <Link to="/Dashboard" className="nav-button">Dashboard</Link>
            <Link to="/inbox" className="nav-button">Chat</Link>
            <Link to="/contact" className="nav-button">Contact us</Link>
            <Link to="/user-profile" className="nav-button">User Profile</Link>
            <Link to="/contracts" className='nav-button'>DocSign</Link>
            
          </div>
          <div className="right-nav">
            <Link to="/">
              <img
                src={`${process.env.PUBLIC_URL}/images/IMG_2582.PNG`}
                alt="Logo"
                className="nav-logo"
                height="50px"
              />
            </Link>
            {!isAuthenticated ? (
              <Link to="/login" className="log-button">Login/Signup</Link>
            ) : (
              <button onClick={logout} className="log-button">Logout</button>
            )}
          </div>
        </nav>
      </header>
      <main>
        <Outlet /> {/* Render child routes */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;