import React, { useEffect, useState } from 'react';

const ActivationLandingPage = () => {
  const [activationStatus, setActivationStatus] = useState('');

  useEffect(() => {
    // Parse the URL to get the token
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedToken = urlParams.get('token');

    // Make POST request to activate account
    fetch(`https://wazpplabs.com:3500/auth/activate/${encodeURIComponent(encryptedToken)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
        setActivationStatus(data.message);
    })
    .catch(() => {
      setActivationStatus('An error occurred. Please try again.');
    });
  }, []);

  return (
    <div>
      <h1>Account Activation</h1>
      <p>{activationStatus}</p>
    </div>
  );
};

export default ActivationLandingPage;