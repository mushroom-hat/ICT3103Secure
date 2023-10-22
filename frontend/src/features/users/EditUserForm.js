import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation();

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation();

    const navigate = useNavigate();

    const [username, setUsername] = useState(user.username);
    const [validUsername, setValidUsername] = useState(false);
    const [pwd, setPwd] = useState(''); // Change 'password' to 'pwd'
    const [validPwd, setValidPwd] = useState(false); // Change 'validPassword' to 'validPwd'
    const [roles, setRoles] = useState(user.roles);

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
    }, [pwd]);

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsername('');
            setPwd('');
            navigate('/dash/users');
        }
    }, [isSuccess, isDelSuccess, navigate]);

    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPwd(e.target.value); // Change 'password' to 'pwd'

    const onSaveUserClicked = async (e) => {
        const updatedUser = {
            id: user.id,
            roles: user.roles, // Keep the existing roles unchanged
        };

        if (username !== user.username) {
            updatedUser.username = username;
        }

        if (pwd) { // Change 'password' to 'pwd'
            updatedUser.pwd = pwd;
        }

        await updateUser(updatedUser);
    };

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id });
    };

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen";
    const validUserClass = !validUsername ? 'form__input--incomplete' : '';
    const validPwdClass = pwd && !validPwd ? 'form__input--incomplete' : '';

    const errContent = (error?.data?.message || delerror?.data?.message) ?? '';

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveUserClicked}
                            disabled={!validUsername || (!pwd && username === user.username) || isLoading}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteUserClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={pwd} // Change 'password' to 'pwd'
                    onChange={onPasswordChanged} // Change 'password' to 'pwd'
                />

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:</label>
                <select
                    id="roles"
                    name="roles"
                    className="form__select"
                    multiple={true}
                    size="3"
                    value={roles}
                    disabled
                >
                    {/* Render the selected roles here */}
                </select>
            </form>
        </>
    );

    return content;
};

export default EditUserForm;
