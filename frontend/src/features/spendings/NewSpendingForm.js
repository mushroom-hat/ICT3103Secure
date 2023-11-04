import React, { useState, useEffect } from "react";
import { useAddNewSpendingMutation } from "./spendingsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";

const AMOUNT_REGEX = /^[0-9]+(\.[0-9]{1,2})?/;

const NewSpendingForm = () => {
  const [addNewSpending, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewSpendingMutation();

  const navigate = useNavigate();

  const [organizationId, setOrganizationId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState(''); // New state for description
  const [validAmount, setValidAmount] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);


  const users = useSelector(selectAllUsers);

  useEffect(() => {
    setValidAmount(AMOUNT_REGEX.test(amount));
  }, [amount]);

  useEffect(() => {
    if (isSuccess) {
      setOrganizationId('');
      setAmount('');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate('/dash/spending');
      }, 3000);
    }
  }, [isSuccess, navigate]);

  const onOrganizationChanged = (e) => setOrganizationId(e.target.value);
  const onAmountChanged = (e) => setAmount(e.target.value);

  const organizationUsers = users.filter(user => user.roles === "Organization");

  const canSave = Boolean(organizationId) && validAmount && !isLoading;

  const onSaveSpendingClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewSpending({ organization: organizationId, amount, description }); // Send description to the server
    }
  };
  const onDescriptionChanged = (e) => setDescription(e.target.value); // Capture description
  const validAmountClass = !validAmount ? 'form__input--incomplete' : '';
  const errClass = isError ? "errmsg" : "offscreen";

  return (
    <>
      {showSuccessMessage && (
        <div className="success-message">
          Spending added successfully!
        </div>
      )}

      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveSpendingClicked}>
        <div className="form__title-row">
          <h2>New Spending</h2>
          <div className="form__action-buttons">
            <button
              type="submit"
              className="icon-button form__submit-button"
              title="Save"
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="organization">
          Organization:
        </label>
        <select
          id="organization"
          name="organization"
          className={`form__select`}
          value={organizationId}
          onChange={onOrganizationChanged}
        >
          <option value="">Select an organization</option>
          {organizationUsers.map(user => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>
        <label className="form__label" htmlFor="amount">
          Amount:
        </label>
        <input
              className="form__input"
              id="description"
              name="description"
              type="text"
              value={description}
              onChange={onDescriptionChanged}

        />
      </form>
    </>
  );
};

export default NewSpendingForm;
