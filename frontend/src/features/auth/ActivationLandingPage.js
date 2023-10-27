import React, { useEffect, useState } from 'react';

const ActivationLandingPage = () => {
  const [activationStatus, setActivationStatus] = useState('');

  useEffect(() => {
    // Parse the URL to get the token
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedToken = urlParams.get('token');
    console.log(encryptedToken);
    // Make POST request to activate account
    fetch(`https://api.wazpplabs.com/auth/activate/${encodeURIComponent(encryptedToken)}`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ encryptedToken: encryptedToken }),
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