import React, { useState, useEffect } from 'react';
import { useUpdateUserMutation } from './usersApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../hooks/useAuth'; // Import useAuth hook
import { useGetUserByIdQuery } from './usersApiSlice'; // Import useGetUserByIdQuery

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const UserProfilePage = () => {
  const [updateUser, {
      isLoading,
      isSuccess,
      isError,
      error,
  }] = useUpdateUserMutation();

  const navigate = useNavigate();
  const { id: userId } = useAuth(); // Get the current user's id using useAuth

  const { data: userData } = useGetUserByIdQuery(userId); // Fetch user data based on the userId

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [pwd, setPwd] = useState(''); // Initialize with an empty string

  useEffect(() => {
      // Set the component state based on userData
      if (userData) {
        setUsername(userData.username);
      }
  }, [userData]);

  useEffect(() => {
      setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
      if (isSuccess) {
          setUsername('');
          setPwd('');
          navigate('/dash/');
      }
  }, [isSuccess, navigate]);

  const onUsernameChanged = e => setUsername(e.target.value);
  const onPasswordChanged = e => setPwd(e.target.value);
  const onSaveUserClicked = () => {
    // Check if the username and password are valid and not in a loading state
    if (validUsername && PWD_REGEX.test(pwd) && !isLoading) {
      // Perform the user update using the updateUser mutation
      updateUser({ id: userId, username, password: pwd });
    }
  };

  // Ensure that the user can save when the username is valid, and the password is valid
  const canSave = validUsername && PWD_REGEX.test(pwd) && !isLoading;

  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? 'form__input--incomplete' : '';
  const validPwdClass = !PWD_REGEX.test(pwd) ? 'form__input--incomplete' : '';

  const errContent = error?.data?.message ?? '';

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
                          disabled={!canSave}
                      >
                          <FontAwesomeIcon icon={faSave} />
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
                  Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
              <input
                  className={`form__input ${validPwdClass}`}
                  id="password"
                  name="password"
                  type="password"
                  value={pwd}
                  onChange={onPasswordChanged}
              />
          </form>
      </>
  );

  return content;
};

export default UserProfilePage;
