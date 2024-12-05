import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51QSiGBF7wkMLsTtpBBzTCQOPHg8otgHraZEnvAO7Tqv1U6vdERKvFIjAfdykTzcZqE8z50u7N69Qspz4Sk4gpbvm00bGltNgjo");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: "'Open Sauce One', Arial, sans-serif",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [invoiceMessage, setInvoiceMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsProcessing(true);

    const response = await fetch("http://127.0.0.1:8000/create-payment-intent/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials:"include",
    });

    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    setIsProcessing(false);

    if (result.error) {
      setError(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      setSuccess("Payment successful! Your invoice will be emailed shortly.");
    }
  };

  const handleCreateInvoice = async () => {
    setInvoiceMessage("");
    try {
      const response = await fetch("http://127.0.0.1:8000/create-invoice/", {
        method: "POST",
      });

      const data = await response.json();
      if (data.message) {
        setInvoiceMessage("Invoice sent successfully to the customer's email!");
      } else if (data.error) {
        setInvoiceMessage(`Failed to create invoice: ${data.error}`);
      }
    } catch (error) {
      setInvoiceMessage("An error occurred while creating the invoice.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center" }}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ color: "#4CAF50" }}>Make a Payment</h2>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            background: isProcessing ? "#ccc" : "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}

      <button
        onClick={handleCreateInvoice}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          background: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Generate Invoice
      </button>
      {invoiceMessage && <p style={{ marginTop: "10px", color: "green" }}>{invoiceMessage}</p>}
    </div>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default PaymentPage;