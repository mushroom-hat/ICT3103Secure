import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Container, Row, Toast } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from 'react-router-dom';

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    pwd: '',
    confirmpwd: '',
    isActive: true,
    token: '',
    tokenKey: '',
    roles: 'Donator',
  });

  const [showToast, setShowToast] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [addNewUser, { isSuccess: mutationSuccess }] = useAddNewUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (mutationSuccess) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dash/users');
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

  const addNewUserClick = async () => {
    try {
      await addNewUser(formData);
      setIsSuccess(mutationSuccess);
    } catch (error) {
      setIsSuccess(false);
    }
    setShowToast(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewUserClick();
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', color: "white" }}>
      <Row className="w-100">
        <Col xs={12} md={8} lg={6} className="mx-auto">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3 text-white justify-content-center">
              <h2>Add User</h2>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" value={formData.username} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="pwd" value={formData.pwd} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" name="confirmpwd" value={formData.confirmpwd} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>roles</Form.Label>
              <Form.Select name="roles" value={formData.roles} onChange={handleInputChange}>
                <option value="Donator">Donator</option>
                <option value="Admin">Admin</option>
                <option value="Organization">Organization</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Is Active</Form.Label>
              <Form.Check type="checkbox" name="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
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
                  Create user successful
                </>
              ) : (
                <>
                  <XCircleFill color="red" className="mr-2" style={{ marginRight: "10px" }} />
                  Fail to create user
                </>
              )}
            </Toast.Body>
          </Toast>
        </Col>
      </Row>
    </Container>
  );
};

export default AddUserForm;
