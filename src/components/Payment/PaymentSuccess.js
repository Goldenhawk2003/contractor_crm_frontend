// src/pages/PaymentSuccess.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Payment.css"; // Assuming you have a CSS file for styling
const PaymentSuccess = () => {
  return (
    <div className="payment-result success">
      <h1>✅ Payment Successful!</h1>
      <p>Thank you for your payment. Your contractor has been notified.</p>
      <Link to="/user-profile" className="user-button">
              Return to Profile
            </Link>
    </div>
  );
};

export default PaymentSuccess;