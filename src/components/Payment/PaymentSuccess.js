// src/pages/PaymentSuccess.jsx
import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="payment-result success">
      <h1>✅ Payment Successful!</h1>
      <p>Thank you for your payment. Your contractor has been notified.</p>
      <Link to="/contracts" className="user-button">
        Back to Contracts
      </Link>
    </div>
  );
};

export default PaymentSuccess;