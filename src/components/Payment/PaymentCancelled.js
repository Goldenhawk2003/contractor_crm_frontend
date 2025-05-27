// src/pages/PaymentCancelled.jsx
import React from "react";
import { Link } from "react-router-dom";

const PaymentCancelled = () => {
  return (
    <div className="payment-result cancelled">
      <h1>⚠️ Payment Cancelled</h1>
      <p>Your transaction was not completed. You can try again anytime.</p>
      <Link to="/contracts" className="user-button">
        Return to Contracts
      </Link>
    </div>
  );
};

export default PaymentCancelled;