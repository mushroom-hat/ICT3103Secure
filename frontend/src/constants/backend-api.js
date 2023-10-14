const prod = {
    url: {
      API_URL: 'https://charsity-backend-container:3500',
    }
  };
  
  const dev = {
    url: {
      API_URL: 'http://localhost:3500'
    }
  };
  
  export const config = process.env.NODE_ENV === 'development' ? dev : prod;
  