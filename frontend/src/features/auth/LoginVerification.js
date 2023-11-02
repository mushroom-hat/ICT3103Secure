import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormControl from "react-bootstrap/FormControl";
import { Container } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Toast, ToastContainer } from 'react-bootstrap';
import { setCredentials } from './authSlice';
import { useDispatch } from 'react-redux';  // Add useSelector
import { useEffect } from 'react';



const EmailVerificationPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userRef = useRef();
    const [verificationCode, setVerificationCode] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [errorMessage, setErrMsg] = useState('');

    const { token, username, roles } = useSelector(state => state.auth);
    console.log("EmailVerificationPage: " + username + " (" + roles + ") ");

    const handleUserInput = (e) => setVerificationCode(e.target.value);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    const handleVerificationCodeSubmit = async (e) => {
        e.preventDefault();
        try {
            // Check if the verification code is valid, 6 digit only.
            if (verificationCode.length !== 6 || isNaN(verificationCode)) {
                // Set an error message
                // Check if all digit
                setErrMsg("Verification code must be 6 digits. ")
                setShowToast(true);
                return;
            }
            // Make an API call to the backend with the entered verification code.
            // If successful and valid, navigate the user to the dashboard or main app.
            // If the code is invalid, set an error message.
            // If the code is valid but expired, set an error message.
            console.log("Done verifying user: " + username + " (" + roles + ") ");
            console.log("Done verifying token: " + token);


            const backendAPI = process.env.REACT_APP_API_BASE_URL;
            const response = await fetch(`${backendAPI}/auth/verify-login-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "username": username, "verificationCode": verificationCode }),
            });
            const responseBody = await response.json(); // Parse the response body as JSON
            console.log("Waiting for response...")
            console.log("Response: ", responseBody);
            console.log("Done getting response.")

            if (responseBody.success) {
                const accessToken = token;
                console.log("Verification code verified successfully. Navigating to dashboard. Setting credentials: " + accessToken + " " + username + " " + roles);
                dispatch(setCredentials({ accessToken, username, roles }));
                navigate('/dash');
            } else {
                console.log("Failed verifying code. Message: ", responseBody.message);
                // Set an error message
                setErrMsg(responseBody.message)
                setShowToast(true);
            }
        } catch (error) {
            // Handle errors that occur during the API call.
            // Set an error message
            setErrMsg("Failed verifying code API endpoint. ")
            setShowToast(true);
        }
    };

    return (
        <div>
            <Container fluid className="project-section">
                <Container>
                    <h1 className="project-heading" style={{ textAlign: 'center' }}>
                        Email Verification
                    </h1>
                </Container>
            </Container>
            <Container>
                <Row style={{ justifyContent: "center", padding: "10px" }}>
                    <Col sm={10} md={8} lg={6} className="project-card">
                        <Card className="login-verification profile-update-card bg-dark text-white">
                            <form className="form" onSubmit={handleVerificationCodeSubmit}>
                                <label style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px" }} htmlFor="verificationCode">Enter the 6-digit code that was sent to your email. </label>
                                <FormControl
                                    className="form__input"
                                    type="text"
                                    id="verificationCode"
                                    ref={userRef}
                                    value={verificationCode}
                                    onChange={handleUserInput}
                                    autoComplete="off"
                                    required style={{ marginLeft: "10px", marginRight: "10px", width: "-webkit-fill-available" }}
                                />
                                <button
                                    className="form__submit-button btn btn-success btn-block btn-lg"
                                    style={{
                                        display: 'block',
                                        marginTop: '10px',
                                        textAlign: 'center',
                                        marginBottom: '10px',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        width: 'fit-content'
                                    }}
                                >
                                    Verify Code
                                </button>
                                {/* <button
                                    className="form__submit-button btn btn-primary btn-block btn-lg"
                                    style={{
                                        display: 'block',
                                        marginTop: '10px',
                                        textAlign: 'center',
                                        marginBottom: '10px',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        width: 'fit-content'
                                    }}
                                >
                                    Resend Code
                                </button> */}
                            </form>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <ToastContainer
                position="top-end"
                className="p-3"
                style={{ zIndex: 9999 , fixed: "top", right: "10px", top: "10px"}}
            >
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000} // Adjust the delay as needed
                    autohide
                    bg="danger" // You can customize the background color
                >
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Error</strong>
                    </Toast.Header>
                    <Toast.Body>{errorMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default EmailVerificationPage;
