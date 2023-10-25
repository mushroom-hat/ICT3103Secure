import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';  // Add useSelector
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';

import { Container, Row, Col, Nav } from "react-bootstrap";
import Particle from "../../components/Particle";
import profile from "../../Assets/Profile/Profile.png";
import { text } from '@fortawesome/fontawesome-svg-core';
import Navbar from "../../components/Navbar";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import FormCheck from "react-bootstrap/FormCheck";
import { current } from '@reduxjs/toolkit';
const Login = () => {
    const userRef = useRef();
    const errRef = useRef();
    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [persist, setPersist] = usePersist();
    

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [username, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { accessToken } = await login({ username, pwd }).unwrap();
            dispatch(setCredentials({ accessToken, username }));
            setUsername('');
            setPwd('');
            navigate('/dash');
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus();
        }
    }

    const handleUserInput = (e) => setUsername(e.target.value);
    const handlePwdInput = (e) => setPwd(e.target.value);
    const handleToggle = () => setPersist(prev => !prev);

    const errClass = errMsg ? "errmsg" : "offscreen";

    if (isLoading) return <p>Loading...</p>;

    const content = (
        <Container fluid className="project-section">
            <Particle />
            <Navbar />
            <Container>
                <h1 className="project-heading" style={{textAlign: 'center'}}>
                    Employee Login
                </h1>
            </Container>

            <section className="public">
                <Container>
                    <Row style={{ justifyContent: "center", padding: "10px" }}>
                        <Col sm={10} md={8} lg={6} className="project-card">
                            <Card className="login profile-update-card bg-dark text-white">
                                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
                                <form className="form" onSubmit={handleSubmit}>
                                    <label style={{ marginTop: "20px", marginLeft: "10px" , marginRight: "10px"}} htmlFor="username">Username:</label>
                                    <FormControl
                                        className="form__input"
                                        type="text"
                                        id="username"
                                        ref={userRef}
                                        value={username}
                                        onChange={handleUserInput}
                                        autoComplete="off"
                                        required style={{ marginLeft: "10px" , marginRight: "10px", width: "-webkit-fill-available"}}
                                    />
                                    <label style={{ marginTop: "20px", marginLeft: "10px" , marginRight: "10px"}} htmlFor="password">Password:</label>
                                    <FormControl
                                        className="form__input"
                                        type="password"
                                        id="password"
                                        value={pwd}
                                        onChange={handlePwdInput}
                                        required style={{ marginLeft: "10px", marginRight: "10px", width: "-webkit-fill-available"}}
                                    />
                                    <label 
                                        htmlFor="persist" 
                                        className="form__persist" 
                                        style={{ display: 'block', marginTop: '10px', marginLeft: "10px" , marginRight: "10px" }}
                                        >
                                        <input
                                            type="checkbox"
                                            className="form__checkbox"
                                            id="persist"
                                            checked={persist}
                                            onChange={handleToggle}
                                            style={{ marginRight: "10px"}}
                                        />
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
                                            Dont have an account? <Link to="/signup">Sign Up</Link>
                                        </label>
                                        

                                </form>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Container>
        
    );

    return content;
}

export default Login;