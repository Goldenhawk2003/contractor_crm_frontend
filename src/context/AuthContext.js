import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Function to check if the user is authenticated
    const checkAuthStatus = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/user-info/", {
                withCredentials: true,
            });
            setIsAuthenticated(!!response.data.username); // If username exists, user is logged in
        } catch (error) {
            console.error("Failed to fetch user info:", error);
            setIsAuthenticated(false);
        }
    };

    const logout = async () => {
      try {
          await axios.post('http://localhost:8000/api/logout/', {}, { withCredentials: true });
          setIsAuthenticated(false); // Update global auth state (if using context)
          window.location.reload(); // Force a full page reload
      } catch (error) {
          console.error('Logout failed:', error);
      }
  };

    useEffect(() => {
        checkAuthStatus(); // Check auth status when the app loads
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);