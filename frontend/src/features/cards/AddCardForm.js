import React, { useState, useEffect } from "react";
import { useAddNewCardMutation } from "./cardsApiSlice";
import { useUpdateUserMutation } from "../users/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { Container } from "react-bootstrap";
import Particle from "../../components/Particle";
import NavBar from "../../components/Navbar";

const AddCardForm = () => {
  const [addNewCard, { isLoading, isSuccess, isError, error }] =
    useAddNewCardMutation();
  const updateUser = useUpdateUserMutation()[0];
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCVC] = useState("");
  const [validCard, setValidCard] = useState(false);

  useEffect(() => {
    // Initialize isCardValid as true
    let isCardValid = true;
  
    // Check if the card number has 16 digits
    if (cardNumber.length !== 16) {
      isCardValid = false;
      console.log("Card Number is invalid")
    }
  
    // Check if the card holder name is not empty
    if (cardHolderName.trim() === '') {
      isCardValid = false;
      console.log("cardHoldeName")

    }
  
    // Check if the expiry date matches MM/YY format
    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      isCardValid = false;
      console.log("expiryDate")

    }
  
    // Check if CVC has 3 digits
    if (cvc.length !== 3) {
      isCardValid = false;
      console.log("cvc")

    }
  
    // Set validCard based on the validation result
    setValidCard(isCardValid);
  }, [cardNumber, cardHolderName, expiryDate, cvc]);
  

  const { username, id } = useAuth();
  const canSave = validCard && id && !isLoading;
  console.log("Valid Card", validCard);
  const onSaveCardClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      const cardResponse = await addNewCard({
        cardNumber,
        cardHolderName,
        expiryDate,
        cvc,
      });

      console.log("Card Response:", cardResponse);

      if (!cardResponse.error) {
        const newCardId = cardResponse.data.id;
        const updateUserResponse = await updateUser({ id, card: newCardId });

        console.log("User Update Response:", updateUserResponse); // Log the response from updateUser function

        navigate("/success");
      }
    }
  };

  return (
    <Container fluid className="project-section">
      <Particle />
      <NavBar />
      <Container>
        {isError && <p className="error-message">{error?.data?.message}</p>}

        <h1 className="project-heading">New Card</h1>

        <form
          className="card-creation-form"
          onSubmit={onSaveCardClicked}
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gridGap: "0.5rem",
            zIndex: 1,
            position: "relative",
            alignItems: "center",
          }}
        >
          <label htmlFor="cardNumber" style={{ color: "white" }}>Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />

          <label htmlFor="cardHolderName" style={{ color: "white" }}>Card Holder Name:</label>
          <input
            type="text"
            id="cardHolderName"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            required
          />

          <label htmlFor="expiryDate" style={{ color: "white" }}>Expiry Date:</label>
          <input
            type="text"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />

          <label htmlFor="cvc" style={{ color: "white" }}>CVC:</label>
          <input
            type="text"
            id="cvc"
            value={cvc}
            onChange={(e) => setCVC(e.target.value)}
            required
          />

          <label htmlFor="user" style={{ color: "white" }}>User:</label>
          <p style={{ color: "white", margin: 0 }}>{username}</p>

          <button type="submit" disabled={!canSave} className="rounded-button">
            Save Card
          </button>
        </form>
      </Container>
    </Container>
  );
};

export default AddCardForm;
