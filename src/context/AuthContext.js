import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Store user details

    // Function to check if the user is authenticated
    const checkAuthStatus = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/user-info/`,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    }
                }
            );
    
            console.log("User data:", response.data);
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
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logout/`, {}, { withCredentials: true });
            setIsAuthenticated(false);
            setUser(null); // Clear user data on logout
            window.location.reload(); // Force a full page reload
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        checkAuthStatus(); // Check auth status when the app loads
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);