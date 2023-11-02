import React from 'react';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

const LoginErrorPage = () => {
  return (
    <Container className="mt-5">
      <Alert variant="danger">
        Login Error, please contact administrator
      </Alert>
    </Container>
  );
};

export default LoginErrorPage;
