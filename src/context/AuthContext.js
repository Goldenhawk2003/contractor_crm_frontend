import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [user, setUser] = useState(null);

  // Set Authorization header on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user-info/`);
      console.log("User info response:", response.data);  // Log user info

      if (response.data.username) {
        setIsAuthenticated(true);
        setUser(response.data);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setAuthLoaded(true);
    }
  };

  const loginUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/`);
        setUser(res.data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Auth error during login:", err);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      delete axios.defaults.headers.common["Authorization"];
      setIsAuthenticated(false);
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Run auth check on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, authLoaded, user, setIsAuthenticated, logout, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);