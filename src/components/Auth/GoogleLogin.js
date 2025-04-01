import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function GoogleLoginButton() {
  const handleSuccess = async (response) => {
    const token = response.credential;

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/google/callback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('access_token', data.token);
        alert('Login successful!');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="flex justify-center items-center mt-4">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.error('Login Failed')}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;