import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useSignupMutation } from './authApiSlice';
import ReCAPTCHA from "react-google-recaptcha";

import { Container, Row, Col, Card, FormControl, Toast } from "react-bootstrap";
import Particle from "../../components/Particle";
import NavBar from "../../components/Navbar";

const Signup = () => {
    const nameRef = useRef(null); // Add a ref for the Name input
    const userRef = useRef(null);
    const emailRef = useRef(null);
    const pwdRef = useRef(null);
    const confirmPwdRef = useRef(null);
    const [name, setName] = useState(''); // Add state for Name
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [signup, { isLoading }] = useSignupMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [captchaValue, setcaptchaValue] = useState(null);


    // State for controlling toast visibility
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');  // New state for Toast message

    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);

    // Validate the name
    const validateName = (name) => {
        // Disallow special characters
        const re = /^[a-zA-Z ]*$/;
        return re.test(name);
    };

    // Validate the password
    const validatePassword = (password) => {
        // Require at least one uppercase, one lowercase, one number, and one special character
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
        return re.test(password);
    };

    const validatePwLength = (password) => {
        // Require at least one uppercase, one lowercase, one number, and one special character
        if (password.length <= 64 ) {
            return true;
        }
    };

    // Validate common/weak password
    const isPasswordWeak = (password) => {
        // Promise to asynchronously check if user password is weak
        return fetch('https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10-million-password-list-top-1000.txt')
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
        })
        .then(fileContent => {
        const weakPasswords = fileContent.split('\n');
        const userEnteredPassword = password;
        if (weakPasswords.includes(userEnteredPassword)) {
            return true;
        } else {
            return false;
        }
        })
        .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        });
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (pwd !== confirmPwd) {
                setToastMsg('The passwords you entered do not match. Please try again.');
                setShowToast(true);
                return;
            }

            if (!validateName(name)) {
                setToastMsg('Name can only contain letters and spaces.');
                setShowToast(true);
                return;
            }
            
            if (await isPasswordWeak(pwd) === true) {
                setToastMsg('Password is commonly used, please set a stronger password');
                setShowToast(true);
                return;
            }

            if (!validatePwLength(pwd)) {
                setToastMsg('Password should not exceed 64 characters');
                setShowToast(true);
                return;
            }

            if (!validatePassword(pwd)) {
                setToastMsg('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
                setShowToast(true);
                return;
            }

            if (!validateEmail(email)) {
                setToastMsg('Please enter a valid email address.');
                setShowToast(true);
                return;
            }

            // console.log("Route Handler: Try block begins");

            let accessToken;
            let customerror;
            let restructureError;
            

            const response = await signup({ name, username, email, pwd, roles: 'Donator', captchaValue });
            if (response.error) {
                //  Set toast message and make it visible
                setToastMsg(response.error.data.message);
                setShowToast(true);
                customerror = response.error;
                // console.log ("This is the customerror", customerror);
            }

            if (customerror) {

                if (customerror.status == 400) {
                    throw new Error(JSON.stringify(customerror))
                }
                //Force an error
                // console.log(customerror);
                // console.log(customerror.data.errors.length)
                restructureError = {
                    status: null,
                    errors: []
                };

                restructureError.status = customerror.status;
                // console.log("To test restructure", restructureError);

                for (let i = 0; i < customerror.data.errors.length; i++){
                    restructureError.errors.push(customerror.data.errors[i].msg);
                };

                // console.log(restructureError);


                throw new Error(JSON.stringify(restructureError));
                
            }

            // console.log("Route Handler: Signup successful");
            navigate('/emailverification');
        } catch (err) {
            let errorCode;
            let combinedErrors

            // console.log("Route Handler: Catch block begins");
            // console.log("This the thrown error", err);
             // Use a regular expression to extract the JSON part
            const jsonMatch = err.message.match(/(\{.*\})/);
            // console.log(jsonMatch);
            
            if (jsonMatch && jsonMatch[1]) {
                try {
                const errorObject = JSON.parse(jsonMatch[1]);
                const status = errorObject.status;
                const errors = errorObject.errors;

                // console.log("Status:", status);
                // console.log("Errors:", errors);

                if(status == 400){
                    const error2 = errorObject.data.error;
                    // console.log("Errors2:", error2);
                    combinedErrors = error2
                }
                else{
                    combinedErrors = errors.join(' ');
                }

                // console.log("Combined Errors:", combinedErrors);

                } catch (parseError) {
                // Handle parsing error if JSON message is not valid
                console.error("Error parsing JSON message:", parseError);
                }
            }

            // Extract error code
            const errorCodeMatch = err.message.match(/\d+/);

            if (errorCodeMatch) {
                errorCode = errorCodeMatch[0];
                // console.log("Error Code:", errorCode);
            }

            // console.log(errorCode);

            if (!errorCode) {
                // Set toast message and make it visible
                setToastMsg('No Server Response');
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
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <Container fluid className="project-section">
            <Particle />
            <NavBar />
            <Container>
                <h1 className="project-heading" style={{ textAlign: 'center' }}>
                    Donator Signup
                </h1>
            </Container>

            <section className="public">
                <Container>
                    <Row style={{ justifyContent: "center", padding: "10px" }}>
                        <Col sm={10} md={8} lg={6} className="project-card">
                            <Card className="signup profile-update-card bg-dark text-white">
                                <form className="form" onSubmit={handleSubmit}>
                                    <label style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px" }} htmlFor="name">Name:</label>
                                    <FormControl
                                        className="form__input"
                                        type="text"
                                        id="name"
                                        ref={nameRef}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoComplete="off"
                                        required style={{ marginLeft: "10px", marginRight: "10px", width: "-webkit-fill-available" }}
                                    />
                                    <label style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px" }} htmlFor="username">Username:</label>
                                    <FormControl
                                        className="form__input"
                                        type="text"
                                        id="username"
                                        ref={userRef}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        autoComplete="off"
                                        required style={{ marginLeft: "10px", marginRight: "10px", width: "-webkit-fill-available" }}
                                    />
                                    <label style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px" }} htmlFor="email">Email:</label>
                                    <FormControl
                                        className="form__input"
                                        type="email"
                                        id="email"
                                        ref={emailRef}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="off"
                                        required style={{ marginLeft: "10px", marginRight: "10px", width: "-webkit-fill-available" }}
                                    />
                                    <label style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px" }} htmlFor="password">Password:</label>
                                    <FormControl
                                        className="form__input"
                                        type="password"
                                        id="password"
                                        ref={pwdRef}
                                        value={pwd}
                                        onChange={(e) => setPwd(e.target.value)}
                                        required style={{ marginLeft: "10px", marginRight: "10px", width: "-webkit-fill-available" }}
                                    />
                                    <label style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px" }} htmlFor="confirmPassword">Confirm Password:</label>
                                    <FormControl
                                        className="form__input"
                                        type="password"
                                        id="confirmPassword"
                                        ref={confirmPwdRef}
                                        value={confirmPwd}
                                        onChange={(e) => setConfirmPwd(e.target.value)}
                                        required style={{ marginLeft: "10px", marginRight: "10px", width: "-webkit-fill-available" }}
                                    />
                                    <ReCAPTCHA sitekey="6Lc-y9AoAAAAAMiiqyIGm7bTg0Yu-fP65ikmncft" onChange={(value) => setcaptchaValue(value)} style={{ marginTop: "10px", marginLeft: "10px" }} />
                                    <button
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
                                        Sign Up
                                    </button>
                                    <label style={{
                                        display: 'block',
                                        marginTop: '10px',
                                        textAlign: 'center',
                                        marginBottom: '10px',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        width: 'fit-content'
                                    }}>
                                        Already have an account? <Link to="/login">Login</Link>
                                    </label>
                                </form>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Bootstrap Toast for password mismatch */}

            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                style={{
                    // Top right of the screen no matter where it is rendered
                    // Now when scroll down its not at the top anymore,
                    // i also want it to be at the front of all elements
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    zIndex: 9999,
                    backgroundColor: 'white',
                }}
                autohide
            >
                <Toast.Header>
                    <strong className="mr-auto">Error!</strong>
                </Toast.Header>
                <Toast.Body>{toastMsg}</Toast.Body>
            </Toast>
        </Container>
    );
}

export default Signup;