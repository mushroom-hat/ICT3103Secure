import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';  // Add useSelector
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import useAuth from '../../hooks/useAuth';

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();
    const {roles} = useAuth();
    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const [id, setId] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [persist, setPersist] = usePersist();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();
    
    const currentUsername = useSelector((state) => state.auth.username);  // Fetch the username from the state

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [username, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { accessToken } = await login({ username, pwd, id}).unwrap();
            dispatch(setCredentials({ accessToken, username }));
            setUsername('');
            setPwd('');
            navigate('/dash');
            console.log("Roles", {roles})
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
        <section className="public">
            <header>
                <h1>Employee Login</h1>
                {currentUsername && <p>Welcome, {currentUsername}, {roles}!</p>}
            </header>
            <main className="login">
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        className="form__input"
                        type="text"
                        id="username"
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        value={pwd}
                        onChange={handlePwdInput}
                        required
                    />
                    <button className="form__submit-button">Sign In</button>
                    <label htmlFor="persist" className="form__persist">
                        <input
                            type="checkbox"
                            className="form__checkbox"
                            id="persist"
                            checked={persist}
                            onChange={handleToggle}
                        />
                        Trust This Device
                    </label>
                </form>
            </main>
            <footer>
                <Link to="/">Back to Home</Link>
                <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            </footer>
        </section>
    );

    return content;
}

export default Login;
