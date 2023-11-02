import React from 'react';
import './LoadingSpinner.css'; // You can create a CSS file for styling

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="lock-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C7.03 2 3 6.03 3 11v4h2v7h14v-7h2v-4c0-4.97-4.03-9-9-9zm0 15h-2v-3h2v3zm0-5h-2V7h2v5z" />
        </svg>
      </div>
      <div className="loading-spinner" style={{marginTop:"10px"}}></div>
      <div className="loading-spinner-text" style={{marginLeft:"10px"}}>Authenticating...</div>
    </div>
  );
};

export default LoadingSpinner;
