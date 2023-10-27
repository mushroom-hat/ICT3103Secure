import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure to import axios

const ActivationLandingPage = () => {
  const [activationStatus, setActivationStatus] = useState('');

  useEffect(() => {
    // Parse the URL to get the token
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedToken = urlParams.get('token');

    // Make POST request to activate account
    // Make POST request to activate the account using Axios
    axios.post(`https://api.wazpplabs.com/auth/activate/${encodeURIComponent(encryptedToken)}`, {
      encryptedToken: encryptedToken
    }).then(response => {
      if (typeof response.data.message === 'object') {
        // Extract specific field from the object
        setActivationStatus(response.data.message.message);
      } else {
        // Set activation status as is
        setActivationStatus(response.data.message);
      }
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