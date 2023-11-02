import React from 'react';
import './LoadingSpinner.css'; // You can create a CSS file for styling

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <div className="loading-spinner-text" style={{marginRight:"10px"}}>Authenticating...</div>
    </div>
  );
};

export default LoadingSpinner;
