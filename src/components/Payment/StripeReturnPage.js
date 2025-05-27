import React, { useEffect } from 'react';

const StripeReturnPage = () => {
  useEffect(() => {
    // optionally refresh user info here to check stripe_account_id
  }, []);

  return (
    <div className="stripe-return-page">
      <h2>✅ You're back from Stripe!</h2>
      <p>Your Stripe account setup may now be complete.</p>
    </div>
  );
};

export default StripeReturnPage;