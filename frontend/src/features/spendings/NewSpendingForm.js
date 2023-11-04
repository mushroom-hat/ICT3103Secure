import React, { useState, useEffect } from 'react';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';

import { useAddNewSpendingMutation } from "./spendingsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";

const AMOUNT_REGEX = /^[0-9]+(\.[0.9]{1,2})/;
const DESCRIPTION_REGEX = /^.{0,500}/;

const NewSpendingForm = () => {
  const [addNewSpending, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewSpendingMutation();

  const navigate = useNavigate();
  const { username, userId } = useAuth();
  const [organizationId, setOrganizationId] = useState(userId || ''); // Assuming you have organizationId
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState(''); // Added description state
  const [validAmount, setValidAmount] = useState(false);
  const [validDescription, setValidDescription] = useState(false);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  const users = useSelector(selectAllUsers);

  useEffect(() => {
    setValidAmount(AMOUNT_REGEX.test(amount));
    setValidDescription(DESCRIPTION_REGEX.test(description));

  }, [amount, description]);

  useEffect(() => {
    if (isSuccess) {
      setOrganizationId('');
      setAmount('');
      setDescription(''); // Clear description
      setShowSuccessMessage(true);
      setIsSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setIsSuccessMessage(false);
        navigate('/dash/spending');
      }, 3000);
    }
  }, [isSuccess, navigate]);

  const onAmountChanged = (e) => setAmount(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);

  const organizationUsers = users.filter(user => user.roles === "Organization");
  const canSave = Boolean(organizationId) && validAmount && validDescription && !isLoading;
  console.log(organizationId)

  const onSaveSpendingClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewSpending({ organization: organizationId, amount, description });
    }
  };

  const validAmountClass = !validAmount ? 'form__input--incomplete' : '';
  const validDescriptionClass = !validDescription ? 'form__input--incomplete' : '';
  const errClass = isError ? "errmsg" : "offscreen";

  return (
    <>
      {showSuccessMessage && (
        <div className={isSuccessMessage ? "success-message" : "error-message"}>
          {isSuccessMessage ? (
            <CheckCircleFill color="green" className="mr-2" style={{ marginRight: "10px" }} />
          ) : (
            <XCircleFill color="red" className="mr-2" style={{ marginRight: "10px" }} />
          )}
          {isSuccessMessage ? "Spending added successfully!" : "Failed to add spending"}
        </div>
      )}

      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveSpendingClicked}>
        <div className="form__title-row">
          <h2>New Spending</h2>
        </div>
        <label className="form__label" htmlFor="organization">
          Organization:
        </label>
        <p>{username}</p>
        <label className="form__label" htmlFor="amount">
          Amount:
        </label>
        <input
          className={`form__input ${validAmountClass}`}
          id="amount"
          name="amount"
          type="text"
          value={amount}
          onChange={onAmountChanged}
        />
        <label className="form__label" htmlFor="description">
          Description:
        </label>
        <input
          className={`form__input ${validDescriptionClass}`}
          id="description"
          name="description"
          type="text"
          value={description}
          onChange={onDescriptionChanged}
        />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </>
  );
};

export default NewSpendingForm;
