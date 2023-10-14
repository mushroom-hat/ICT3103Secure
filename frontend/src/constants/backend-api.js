const prod = {
    url: {
      API_URL: 'http://api.wazpplabs.com:3500',
    }
  };
  
  const dev = {
    url: {
      API_URL: 'http://localhost:3500'
    }
  };
  
  export const config = process.env.NODE_ENV === 'development' ? dev : prod;
  