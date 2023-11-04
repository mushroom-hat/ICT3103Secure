import React, { useState, useEffect } from "react";
import { useAddNewSpendingMutation } from "./spendingsApiSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import Particle from "../../components/Particle";
import { Container } from "react-bootstrap";
import NavBar from "../../components/Navbar";

const AMOUNT_REGEX = /^[0-9]+(\.[0-9]{1,2})?/;

const NewSpendingForm = () => {
  const [addNewSpending, { isLoading, isSuccess, isError, error }] =
    useAddNewSpendingMutation();

  const navigate = useNavigate();

  const [organizationId, setOrganizationId] = useState("");
  const [amount, setAmount] = useState("");
  const [validAmount, setValidAmount] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const users = useSelector(selectAllUsers);

  useEffect(() => {
    setValidAmount(AMOUNT_REGEX.test(amount));
  }, [amount]);

  useEffect(() => {
    if (isSuccess) {
      setOrganizationId("");
      setAmount("");
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate("/dash/spending");
      }, 3000);
    }
  }, [isSuccess, navigate]);

  const onOrganizationChanged = (e) => setOrganizationId(e.target.value);
  const onAmountChanged = (e) => setAmount(e.target.value);

  const organizationUsers = users.filter(
    (user) => user.roles === "Organization"
  );

  const canSave = Boolean(organizationId) && validAmount && !isLoading;

  const onSaveSpendingClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewSpending({ organization: organizationId, amount });
    }
  };

  const validAmountClass = !validAmount ? "form__input--incomplete" : "";
  const errClass = isError ? "errmsg" : "offscreen";

  return (
    <Container fluid className="project-section">
      <Particle />
      <NavBar />
      <Container>
        {showSuccessMessage && (
          <div className="success-message">Spending added successfully!</div>
        )}

        <p className={errClass}>{error?.data?.message}</p>
        <h1 className="project-heading">New Spending</h1>
        <form className="form" onSubmit={onSaveSpendingClicked} style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gridGap: "0.5rem",
            zIndex: 1,
            position: "relative",
            paddingTop: "0.5rem"
          }}>
          <label className="form__label" htmlFor="organization" style={{ color: "white" }}>
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
            {organizationUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
          <label className="form__label" htmlFor="amount" style={{ color: "white" }}>
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
        </form>
      </Container>
    </Container>
  );
};

export default NewSpendingForm;
