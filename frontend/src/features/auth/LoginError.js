import React from 'react';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const LoginErrorPage = () => {
  return (
    <Container className="d-flex flex-column align-items-center mt-5">
      <Alert variant="danger">
        Login Error, please contact administrator.
      </Alert>
      <Button variant="primary" as={Link} to="/login" className="mt-3">
        Go back to login page
      </Button>
    </Container>
  );
};

export default LoginErrorPage;
