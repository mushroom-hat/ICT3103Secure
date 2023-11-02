import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';

import { Container, Row, Col } from "react-bootstrap";
import Particle from "../../components/Particle";
import Navbar from "../../components/Navbar";
import Card from "react-bootstrap/Card";
import FormControl from "react-bootstrap/FormControl";
import { Toast } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../components/LoadingSpinner';

const Login = () => {
    const userRef = useRef();
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [persist, setPersist] = usePersist();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login] = useLoginMutation();
    const [isLoadingUI, setIsLoadingUI] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        // Set a timeout to clear the error message after 3 seconds
        const timeoutId = setTimeout(() => {
            setErrMsg('');
        }, 3000);

        return () => {
            // Clear the timeout when the component unmounts or when errMsg changes
            clearTimeout(timeoutId);
        };
    }, [errMsg]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { accessToken, roles } = await login({ username, pwd }).unwrap();
            console.log("Res Data: " + accessToken + " " + username + " " + roles);

            if (accessToken !== null) {
                setIsLoadingUI(true);
                const backendAPI = process.env.REACT_APP_API_BASE_URL;
                const response = await fetch(`${backendAPI}/auth/verify-login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }, body: JSON.stringify({ username })
                });
                console.log("Res: " + response);
                console.log("Res Body: " + response.body);
                if (response.status === 200) {
                    dispatch(setCredentials({ accessToken, username, roles }));
                    setUsername('');
                    setPwd('');
                    setIsLoadingUI(false);
                    navigate('/verify-login');
                } 

                // Check Response Body
                if (response.body.error === 444) {
                    setIsLoadingUI(false);
                    setErrMsg('Account Locked Out. Please contact administrator.');
                } else if(response.body.error === 445){
                    console.log("Error: " + response.body);
                    setIsLoadingUI(false);
                    dispatch(setCredentials({ username }));
                    navigate('/sendemailverification');
                } else {
                    console.log("Error: " + response.body);
                    setUsername('');
                    setPwd('');
                    navigate('/login-error');
                }

            } else {
                setUsername('');
                setPwd('');
                navigate('/login-error');
            }
        } catch (err) {
            console.error('Failed to log in:', err);
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg(err.data?.message);
            } else if (err.status === 402) {
                const attemptsAsString = err.data?.attempts;
                const attemptsAsInt = parseInt(attemptsAsString, 10);
                const result = 5 - attemptsAsInt;
                setErrMsg(err.data?.message + " Password will be locked out in another " + result.toString() + " attempts.");
            } else if (err.status === 445 || err.data?.error === 445) {
                dispatch(setCredentials({ username }));
                navigate('/sendemailverification')
            }
            else {
                console.error('Unknown error occurred:', err.status);
                setErrMsg(err.data?.message);
            }
        }
    }

    const handleUserInput = (e) => setUsername(e.target.value);
    const handlePwdInput = (e) => setPwd(e.target.value);
    const handleToggle = () => setPersist(prev => !prev);

    if (isLoadingUI) return <LoadingSpinner />;


    return (
        <><div>
            {isLoadingUI && <LoadingSpinner />} {/* Display the spinner when isLoading is true */}
        </div>

            <Container fluid className="project-section">
                <Particle />
                <Navbar />
                <Container>
                    <h1 className="project-heading" style={{ textAlign: 'center' }}>
                        Employee Login
                    </h1>
                </Container>

                <section className="public">
                    <Container>
                        <Row style={{ justifyContent: "center", padding: "10px" }}>
                            <Col sm={10} md={8} lg={6} className="project-card">
                                <Card className="login profile-update-card bg-dark text-white">
                                    {/* Error Toast */}
                                    <Toast
                                        show={errMsg !== ''}
                                        onClose={() => setErrMsg('')}
                                        autohide={true}
                                        delay={3000} // Autohide after 3 seconds
                                        style={{
                                            position: 'fixed',
                                            top: '20px',
                                            right: '20px',
                                            minWidth: '200px',
                                            backgroundColor: 'white',
                                            color: 'black', // Black text
                                        }}
                                    >
                                        <Toast.Header>
                                            <strong className="mr-auto">Error</strong>
                                        </Toast.Header>
                                        <Toast.Body>{errMsg}</Toast.Body>
                                    </Toast>

                                    <form className="form" onSubmit={handleSubmit}>
                                        <label style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px" }} htmlFor="username">Username:</label>
                                        <FormControl
                                            className="form__input"
                                            type="text"
                                            id="username"
                                            ref={userRef}
                                            value={username}
                                            onChange={handleUserInput}
                                            autoComplete="off"
                                            required style={{ marginLeft: "10px", marginRight: "10px", width: "-webkit-fill-available" }} />
                                        <label style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px" }} htmlFor="password">Password:</label>
                                        <FormControl
                                            className="form__input"
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            value={pwd}
                                            onChange={handlePwdInput}
                                            required style={{ marginLeft: "10px", marginRight: "10px", width: "-webkit-fill-available" }} />
                                        <FontAwesomeIcon
                                            icon={showPassword ? faEyeSlash : faEye}
                                            onClick={togglePasswordVisibility}
                                            className="eye-icon"
                                            style={{
                                                cursor: 'pointer',
                                                position: 'absolute',
                                                right: '20px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                zIndex: 1,
                                                color: 'rgba(0, 0, 0, 0.5)',
                                                fontSize: '1rem',
                                            }} />
                                        <label
                                            htmlFor="persist"
                                            className="form__persist"
                                            style={{ display: 'block', marginTop: '10px', marginLeft: "10px", marginRight: "10px" }}
                                        >
                                            <input
                                                type="checkbox"
                                                className="form__checkbox"
                                                id="persist"
                                                checked={persist}
                                                onChange={handleToggle}
                                                style={{ marginRight: "10px" }} />
                                            Trust This Device
                                        </label>
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
                                            Sign In
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
                                            Don't have an account? <Link to="/signup">Sign Up</Link>
                                        </label>
                                    </form>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </Container></>
    );
}

export default Login;
