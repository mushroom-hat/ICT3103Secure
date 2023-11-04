import React, { useState, useEffect } from "react";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import { useAddNewSpendingMutation } from "./spendingsApiSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import Particle from "../../components/Particle";
import { Container } from "react-bootstrap";
import NavBar from "../../components/Navbar";

const AMOUNT_REGEX = /^[0-9]+(\.[0-9]{1,2})$/;
const DESCRIPTION_REGEX = /^.{0,500}/;

const NewSpendingForm = () => {
  const [addNewSpending, { isLoading, isSuccess, isError, error }] =
    useAddNewSpendingMutation();

  const navigate = useNavigate();
  const { username, id } = useAuth();
  console.log("userId", id);
  const [organizationId, setOrganizationId] = useState(id);
  const [amount, setAmount] = useState(""); // Initialize with an empty string
  const [description, setDescription] = useState("");
  const [validAmount, setValidAmount] = useState(false);
  const [validDescription, setValidDescription] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const users = useSelector(selectAllUsers);

  useEffect(() => {
    if (isSuccess) {
      setOrganizationId("");
      setAmount("");
      setDescription("");
      setShowSuccessMessage(true);
      setIsSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setIsSuccessMessage(false);
        navigate("/dash/spending");
      }, 3000);
    }
  }, [isSuccess, navigate]);

  const onAmountChanged = (e) => {
    
  };
  

  const onDescriptionChanged = (e) => setDescription(e.target.value);

  const organizationUsers = users.filter(
    (user) => user.roles === "Organization"
  );
  const canSave =
    organizationId !== null && amount !== null && description !== null && !isLoading;
  console.log(validAmount)
  const onSaveSpendingClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewSpending({
        organization: organizationId,
        amount,
        description,
      });
      console.log("CANSAVE")
    }
  };

  const validAmountClass = !validAmount ? "form__input--incomplete" : "";
  const validDescriptionClass = !validDescription
    ? "form__input--incomplete"
    : "";
  const errClass = isError ? "errmsg" : "offscreen";

  return (
    <Container fluid className="project-section">
      <Particle />
      <NavBar />
      <Container>
        {showSuccessMessage && (
          <div
            className={isSuccessMessage ? "success-message" : "error-message"}
          >
            {isSuccessMessage ? (
              <CheckCircleFill
                color="green"
                className="mr-2"
                style={{ marginRight: "10px" }}
              />
            ) : (
              <XCircleFill
                color="red"
                className="mr-2"
                style={{ marginRight: "10px" }}
              />
            )}
            {isSuccessMessage
              ? "Spending added successfully!"
              : "Failed to add spending"}
          </div>
        )}
        <p className={errClass}>{error?.data?.message}</p>
        <h1 className="project-heading">New Spending</h1>
        <form
          className="form"
          onSubmit={onSaveSpendingClicked}
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gridGap: "0.5rem",
            zIndex: 1,
            position: "relative",
            alignItems: "center",
          }}
        >
          <label
            className="form__label"
            htmlFor="organization"
            style={{ color: "white" }}
          >
            Organization:
          </label>
          <p style={{ color: "white", margin: 0 }}>{username}</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              color: "white",
            }}
          >
            <label className="form__label" htmlFor="amount">
              Amount:
            </label>
            <p style={{ margin: 0 }}>$</p>
          </div>
          <input
            className={`form__input ${validAmountClass}`}
            id="amount"
            name="amount"
            type="text"
            value={amount}
            onChange={onAmountChanged}
          />
          <label
            className="form__label"
            htmlFor="description"
            style={{ color: "white" }}
          >
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
          <button type="submit" className="rounded-button">
            Submit
          </button>
        </form>
      </Container>
    </Container>
  );
};

export default NewSpendingForm;
