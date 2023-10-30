import React, { useState } from 'react';
import { Modal, Button, Form, Toast } from 'react-bootstrap';
import { useUpdateUserMutation } from './usersApiSlice';

const EditModal = ({ userSelected, show, handleClose }) => {
  const {
    id,
    username: userUsername,
    name: userName,
    email: userEmail,
    isActive: userActive,
    roles: userRoles,
  } = userSelected;

  const [username, setUsername] = useState(userUsername);
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [isActive, setIsActive] = useState(userActive);
  const [roles, setRoles] = useState(userRoles);

  const [updateUser, { isSuccess, isError }] = useUpdateUserMutation();
  const [showToast, setShowToast] = useState(false);

  const handleSave = async () => {
    await updateUser({ id, name, username, email, roles, isActive });
    setShowToast(true);
    if (isSuccess) {
      console.log('Updated user successfully');
    }
    handleClose();
  };

  return (
    <>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        <Toast.Header>
          <strong className="mr-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>
          {isSuccess ? (
            <>
              <i className="bi bi-check-circle-fill text-success"></i> Successfully updated
            </>
          ) : isError ? (
            <>
              <i className="bi bi-x-circle-fill text-danger"></i> Failed to update
            </>
          ) : null}
        </Toast.Body>
      </Toast>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="username" style={{ marginTop: '10px' }}>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="name" style={{ marginTop: '10px' }}>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="email" style={{ marginTop: '10px' }}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="isActive" style={{ marginTop: '10px' }}>
              <Form.Label>Is Active</Form.Label>
              <Form.Control
                as="select"
                value={isActive}
                onChange={(e) => setIsActive(JSON.parse(e.target.value))}
              >
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="roles" style={{ marginTop: '10px' }}>
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={roles}
                onChange={(e) => setRoles(e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Donator">Donator</option>
                <option value="Organization">Organization</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditModal;
