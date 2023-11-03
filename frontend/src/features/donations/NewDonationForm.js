import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useAddNewDonationMutation } from './donationsApiSlice';
import { useGetUserByUsernameQuery } from '../users/usersApiSlice';
import { useSelector } from "react-redux";
import Particle from "../../components/Particle";
import Navbar from "../../components/Navbar";
import { Container } from "react-bootstrap";

function NewDonationForm() {
  const { id, username, roles } = useAuth();
  console.log("id", id);
  
  const { data, isLoading: isUserDataLoading, isError: isUserDataError, error: userDataError } = useGetUserByUsernameQuery(username);
  console.log("useData", data?.username);

  const [amount, setAmount] = useState('');
  //const [hasCard, setHasCard] = useState(false); // Track whether the user has a card
  const [createDonation, { isLoading, isError: isDonationError, error: donationError }] = useAddNewDonationMutation();


  const handleCreateDonation = () => {
    console.log("Button clicked"); // Add this line

    if (amount && data?.card !== null) {
      console.log("Amount and card data are valid");
      createDonation({ userId: id, amount: amount });
    }
    else {
      console.log("Amount or card data are invalid");
    }
  };

  if (isUserDataLoading) {
    // You can render a loading message or spinner here
    return <p>Loading user data...</p>;
  }

  if (isUserDataError) {
    // Handle the error if user data retrieval fails
    return <p>Error: {userDataError.message}</p>;
  }

  return (
    <Container fluid className="project-section">
      <Particle />
      <Navbar />
      <Container>
        <h1 className="project-heading">Make a Donation!</h1>
        <p style={{ color: "white" }}>You are logged in as: {username}</p>
        <div style={{ position: "relative", paddingBottom: "0.5rem" }}>
          <label
            htmlFor="amountInput"
            style={{ color: "white", paddingRight: "0.5rem" }}
          >
            Please enter the amount you wish to donate: $
          </label>
          <input
            type="number"
            id="amountInput"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ zIndex: 1, position: "relative" }}
          />
        </div>
        {isDonationError && <p>Error: {donationError.message}</p>}
        <button
          onClick={handleCreateDonation}
          disabled={isLoading}
          className="rounded-button"
        >
          Donate
        </button>
      </Container>
    </Container>
  );
}

export default NewDonationForm;
