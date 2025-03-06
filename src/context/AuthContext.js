import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Store user details

  // When the provider mounts, check if an access token exists and set the default Authorization header.
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  // Function to check if the user is authenticated based on token
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user-info/`);
      if (response.data.username) {
        setIsAuthenticated(true);
        setUser(response.data); // Store user details like username, email, etc.
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Function to log out the user by removing tokens and clearing Axios headers
  const logout = async () => {
    try {
      // Optionally, call a logout endpoint if needed.
      // await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logout/`);
      
      // Remove tokens from localStorage and Axios defaults
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      delete axios.defaults.headers.common["Authorization"];
      
      setIsAuthenticated(false);
      setUser(null);
      
      // Optionally force a reload to update UI state.
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Check authentication status when the component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);