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
  const [toastMsg, setToastMsg] = useState('');  // New state for Toast message

  let customerror;
  let restructureError;
  

  const handleSave = async () => {

    try{
        const response = await updateUser({ id, name, username, email, roles, isActive });
        console.log("this is the result", response);

        try{
          if (response.data.status == 200) {
            console.log('Updated user successfully');
            setToastMsg('Updated user successful');
            setShowToast(true);
            handleClose(); // Close the modal
            return; // Return early to stop further execution
          }
        }
        catch{
          console.log("this works i guess")
        }

          console.log("mate we have a problem");
          console.log(response.error);
          customerror = response.error;

          if (response.error.status == 400){
            throw new Error(JSON.stringify(customerror))
          }

          if (customerror) {
            //Force an error
            console.log(customerror);
            console.log(customerror.data.errors.length)
            restructureError = {
                status: null,
                errors: []
            };

            restructureError.status = customerror.status;
            console.log("To test restructure", restructureError);

            for (let i = 0; i < customerror.data.errors.length; i++){
                restructureError.errors.push(customerror.data.errors[i].msg);
            };

            console.log(restructureError);


            throw new Error(JSON.stringify(restructureError));
            
        }

    }
    catch(err){
      let errorCode;
      let combinedErrors;
      let newbornerror;

      console.log("Route Handler: Catch block begins");
      newbornerror = JSON.stringify(err);
      console.log("This the thrown error", newbornerror);
       // Use a regular expression to extract the JSON part
      const jsonMatch = err.message.match(/(\{.*\})/);
      console.log(jsonMatch);
      
      if (jsonMatch && jsonMatch[1]) {
          try {
          const errorObject = JSON.parse(jsonMatch[1]);
          const status = errorObject.status;
          const errors = errorObject.errors;

          console.log("Status:", status);
          console.log("Errors:", errors);

          if(status == 400){
              const error2 = errorObject.data.error;
              console.log("Errors2:", error2);
              combinedErrors = error2
          }
          else{
              combinedErrors = errors.join(' ');
          }

          console.log("Combined Errors:", combinedErrors);

          } catch (parseError) {
          // Handle parsing error if JSON message is not valid
          console.error("Error parsing JSON message:", parseError);
          }
      }

      // Extract error code
      const errorCodeMatch = err.message.match(/\d+/);

      if (errorCodeMatch) {
          errorCode = errorCodeMatch[0];
          console.log("Error Code:", errorCode);
      }

      console.log(errorCode);

      if (!errorCode) {
          // Set toast message and make it visible
          setToastMsg('Error Occured!');
          setShowToast(true);
      } else if (parseInt(errorCode, 10) === 400) {
          // Set toast message and make it visible
          setToastMsg(combinedErrors);
          setShowToast(true);
      } else if (parseInt(errorCode, 10) === 422) {
          // Set toast message and make it visible
          setToastMsg(combinedErrors);
          setShowToast(true);
      } else {
          // Set toast message and make it visible
          setToastMsg('Signup Failed');
          setShowToast(true);
      }

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
          {toastMsg}
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
