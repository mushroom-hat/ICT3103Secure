import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useSignupMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import ReCAPTCHA from "react-google-recaptcha";

import { Container, Row, Col, Card, FormControl, Button, Toast } from "react-bootstrap";
import Particle from "../../components/Particle";
import Navbar from "../../components/Navbar";

const Signup = () => {
    const nameRef = useRef(null); // Add a ref for the Name input
    const userRef = useRef(null);
    const emailRef = useRef(null);
    const pwdRef = useRef(null);
    const confirmPwdRef = useRef(null);
    const errRef = useRef();
    const [name, setName] = useState(''); // Add state for Name
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [signup, { isLoading }] = useSignupMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [captchaValue, setcaptchaValue] = useState(null);


    // State for controlling toast visibility
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (pwd !== confirmPwd) {
                setShowToast(true);
                return;
            }

            const { accessToken } = await signup({ name, username, email, pwd, roles: 'Donator', captchaValue });
            dispatch(setCredentials({ accessToken }));
            setName('');
            setUsername('');
            setEmail('');
            setPwd('');
            setConfirmPwd('');
            navigate('/emailverification');
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Signup Failed');
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus();
        }
    };

    const errClass = errMsg ? "errmsg" : "offscreen";

    if (isLoading) return <p>Loading...</p>;

    return (
        <Container fluid className="project-section">
            <Particle />
            <Navbar />
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
                                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
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
                                    <ReCAPTCHA sitekey="6Lc-y9AoAAAAAMiiqyIGm7bTg0Yu-fP65ikmncft" onChange={(value) => setcaptchaValue(value)} style={{marginTop:"10px", marginLeft:"10px"}}/>
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
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                }}
                autohide
            >
                <Toast.Header>
                    <strong className="mr-auto">Password Mismatch</strong>
                </Toast.Header>
                <Toast.Body>The passwords you entered do not match. Please try again.</Toast.Body>
            </Toast>
        </Container>
    );
}

export default Signup;
