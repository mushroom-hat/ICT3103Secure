import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useSignupMutation } from './authApiSlice';  // Assuming you created a signup mutation
import usePersist from '../../hooks/usePersist';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userRef = useRef();
    const pwdRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [signup, { isLoading }] = useSignupMutation();

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
        <section className="public">
            <header>
                <h1>Donator Signup</h1>
            </header>
            <main className="signup">
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        className="form__input"
                        type="text"
                        id="username"
                        ref={userRef}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        ref={pwdRef}
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        required
                    />

                    <button className="form__submit-button">Sign Up</button>
                </form>
            </main>
            <footer>
                <Link to="/">Back to Home</Link>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </footer>
        </section>
    );
}

export default Signup;
