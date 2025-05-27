import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StripeReturnPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Force a refresh of user info
    const refreshUserInfo = async () => {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user-info/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("user_info", JSON.stringify(data)); // optional
        // Redirect back to dashboard or payments
        navigate("/user-profile", { replace: true });
      } else {
        console.error("Failed to refresh user info");
      }
    };

    refreshUserInfo();
  }, [navigate]);

  return <p>Returning from Stripe, verifying your account...</p>;
};

export default StripeReturnPage;