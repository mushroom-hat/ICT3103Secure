import React, { useState } from 'react';
import { Container, Row, Col, Button, Toast } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


const SendEmailVerificationPage = () => {
    const [showToast, setShowToast] = useState(false); // State to control toast visibility
    const [toastVariant, setToastVariant] = useState('success'); // Variant for the toast message
    const [toastMessage, setToastMessage] = useState(''); // Message for the toast
    const { username } = useSelector(state => state.auth);
    console.log("SendEmailVerificationPage: " + username);


    const sendVerificationEmail = async () => {
        try {
            // Perform a POST request to /auth/send-verification-email here
            // You can use libraries like axios or fetch to send the request
            // Example using axios:
            // await axios.post('/auth/send-verification-email');

            const backendAPI = process.env.REACT_APP_API_BASE_URL;
            const response = await fetch(`${backendAPI}/auth/send-verification-emai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "username": username }),
            });
            const responseBody = await response.json(); // Parse the response body as JSON
            console.log("Waiting for response...")
            console.log("Response: ", responseBody);
            console.log("Done getting response.")

            if (responseBody.success) {
                // If the request is successful, set the success toast
                setToastVariant('success');
                setToastMessage('Email sent successfully.');
            }else{
                setToastVariant('danger');
                setToastMessage('Error sending verification email with mailing server.');
            }
        } catch (error) {
            // Handle errors if the request fails
            console.error('Error sending verification email:', error);

            // Set the error toast
            setToastVariant('danger');
            setToastMessage('Error sending verification email.');
        } finally {
            // Always show the toast, whether it's success or error
            setShowToast(true);
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Row>
                <Col className="text-center" style={{ color: 'white' }}>
                    <h1>Account Not Activated!</h1>
                    <p>Click the button below to send a verification email to your account.</p>
                    <Button variant="primary" onClick={sendVerificationEmail}>
                        Send Verification Email
                    </Button>
                    <br />
                    <br />
                    <Link to="/login">
                        <Button variant="secondary">Go to Login</Button>
                    </Link>
                </Col>
            </Row>

            {/* Toast component to display the success or error message */}
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                }}
                delay={3000} // Auto-dismiss after 3 seconds
                autohide
                bg={toastVariant} // Set the background color based on toastVariant
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </Container>
    );
};

export default SendEmailVerificationPage;
