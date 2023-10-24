import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useSignupMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';

import { Container, Row, Col, Card, FormControl, Button } from "react-bootstrap";
import Particle from "../../components/Particle";
import Navbar from "../../components/Navbar";

const Signup = () => {
    const userRef = useRef();
    const pwdRef = useRef();
    const errRef = useRef();
    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [signup, { isLoading }] = useSignupMutation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { accessToken } = await signup({ username, pwd, roles: 'Donator' }).unwrap();
            dispatch(setCredentials({ accessToken }));
            setUsername('');
            setPwd('');
            navigate('/dash');
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
        </Container>
    );
}

export default Signup;
