import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_live_51RTPcUKXBwzuzWmbCGe2UYZnGVBNWDyp4sIWyvFNunId6DSYiIz2LczZXuY1oIWh5RCu2EVCTexbAdzDNAhdK4DA00gnVbg2ei");

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

const PaymentForm = ({ contractId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsProcessing(true);

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pay-contract/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contract_id: contractId }),
      });

      const { client_secret: clientSecret, error: backendError } = await response.json();

      if (backendError || !clientSecret) {
        setError(backendError || "Failed to get client secret");
        setIsProcessing(false);
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Client", // You can replace with user name
          },
        },
      });

      setIsProcessing(false);

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setSuccess("✅ Payment successful! Funds will be transferred to the contractor.");
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed due to a network or server issue.");
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center" }}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ color: "#4CAF50" }}>Make a Payment</h2>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
        <button type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
    </div>
  );
};

const PaymentPage = () => {
  const { contractId } = useParams(); // assumes route like /payment/:contractId

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm contractId={contractId} />
    </Elements>
  );
};

export default PaymentPage;