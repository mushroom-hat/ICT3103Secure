import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useAddNewDonationMutation } from './donationsApiSlice';
import { useGetUserByUsernameQuery } from '../users/usersApiSlice';
import { useSelector } from "react-redux";
import Particle from "../../components/Particle";
import Navbar from "../../components/Navbar";
import { Container } from "react-bootstrap";

function NewDonationForm() {
  const { id, username } = useAuth();
  console.log("id", id);

  const { data, isLoading: isUserDataLoading, isError: isUserDataError, error: userDataError } = useGetUserByUsernameQuery(username);
  console.log("useData", data?.username);

  const [amount, setAmount] = useState('');
  const [createDonation, { isLoading, isError: isDonationError, error: donationError }] = useAddNewDonationMutation();

  const handleCreateDonation = () => {
    if (amount && data?.card !== null) { // Use optional chaining to access data safely
      createDonation({ userId: id, amount: Number(amount) });
      console.log("gay")

    }
    else{
      console.log("gay")
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
        {!data?.card && (
          <p style={{ color: "white" }}>
            Please add a payment method to make a donation.
          </p>
        )}
        {isDonationError && <p>Error: {donationError.message}</p>}
        <button
          onClick={handleCreateDonation}
          disabled={!amount || isLoading || data?.card !== null} // Adjust the conditions for disabling the button
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            backgroundColor: "#c770f0",
            color: "white",
            border: "none",
          }}
        >
          Donate
        </button>
      </Container>
    </Container>
  );
}

export default NewDonationForm;
