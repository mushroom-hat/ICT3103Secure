import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { XCircleFill } from 'react-bootstrap-icons';

const ActivationLandingPage = () => {
  const [activationStatus, setActivationStatus] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedToken = urlParams.get('token');
    const backendAPI = process.env.REACT_APP_API_BASE_URL;

    axios.post(`${backendAPI}/auth/activate/${encodeURIComponent(encryptedToken)}`, {
      encryptedToken: encryptedToken
    })
    .then(response => {
      if (typeof response.data.message === 'object') {
        setActivationStatus(response.data.message.message);
      } else {
        setActivationStatus(response.data.message);
      }
    })
    .catch(() => {
      setActivationStatus('An error occurred. Please try again.');
    });
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="text-center" style={{color:"white"}}>
        {activationStatus === 'An error occurred. Please try again.' ? 
          <XCircleFill color="red" size={48} style={{marginBottom:"10px"}}/> : 
          null
        }
        <h1>Account Activation</h1>
        <p>{activationStatus}</p>
        <Link to="/login" className="btn btn-primary">Go to Login</Link>
      </div>
    </div>
  );
};

export default ActivationLandingPage;
