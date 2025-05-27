// src/pages/PaymentCancelled.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Payment.css"; // Assuming you have a CSS file for styling
const PaymentCancelled = () => {
  return (
    <div className="payment-result cancelled">
      <h1>⚠️ Payment Cancelled</h1>
      <p>Your transaction was not completed. You can try again anytime.</p>
      <Link to="/user-profile" className="user-button">
        Return to Profile
      </Link>
    </div>
  );
};

export default PaymentCancelled;