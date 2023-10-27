import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CheckEmailPage = () => {
  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Row>
        <Col className="text-center" style={{color:"white"}}>
          <h1>Account Created Successfully. Please Check Your Email</h1>
          <p>We've sent you an email to activate your account.</p>
          <Link to="/login">
            <Button variant="primary">Go to Login</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckEmailPage;
