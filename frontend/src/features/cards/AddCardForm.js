import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Container, Row, Toast } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import { useAddNewCardMutation } from "./cardsApiSlice"; // Import the appropriate API slice
import { useNavigate } from 'react-router-dom';

const AddCardForm = () => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvc: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [addNewCard, { isSuccess: mutationSuccess }] = useAddNewCardMutation(); // Replace with the correct mutation
  const navigate = useNavigate();

  useEffect(() => {
    if (mutationSuccess) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/cards'); // Replace with the appropriate route
      }, 3000);
    }
  }, [mutationSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addNewCardClick = async () => {
    try {
      await addNewCard(formData);
      setIsSuccess(mutationSuccess);
    } catch (error) {
      setIsSuccess(false);
    }
    setShowToast(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewCardClick();
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', color: "white" }}>
      <Row className="w-100">
        <Col xs={12} md={8} lg={6} className="mx-auto">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3 text-white justify-content-center">
              <h2>Add Card</h2>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Card Holder Name</Form.Label>
              <Form.Control type="text" name="cardHolderName" value={formData.cardHolderName} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control type="text" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CVC</Form.Label>
              <Form.Control type="text" name="cvc" value={formData.cvc} onChange={handleInputChange} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>

          <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide style={{
            position: 'absolute',
            top: 20,
            right: 20,
            minWidth: 200,
            color: "black"
          }}>
            <Toast.Header>
              <strong className="mr-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body>
              {isSuccess ? (
                <>
                  <CheckCircleFill color="green" className="mr-2" style={{ marginRight: "10px" }} />
                  Create card successful
                </>
              ) : (
                <>
                  <XCircleFill color="red" className="mr-2" style={{ marginRight: "10px" }} />
                  Fail to create card
                </>
              )}
            </Toast.Body>
          </Toast>
        </Col>
      </Row>
    </Container>
  );
};

export default AddCardForm;
