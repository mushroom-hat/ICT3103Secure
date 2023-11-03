import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useAddNewDonationMutation } from './donationsApiSlice';
import { useGetUserByIdQuery } from '../users/usersApiSlice';
import { useGetUserByUsernameQuery } from '../users/usersApiSlice'; // Replace with the correct path
import { useSelector } from "react-redux";

function NewDonationForm() {
  const { id, username } = useAuth();
  console.log("id", id);
  
  const { data } = useGetUserByUsernameQuery(username);
  console.log("useQuery", useGetUserByUsernameQuery(username))
  console.log("useData", data)
  //console.log("userData", userData)
  const [amount, setAmount] = useState('');
  //const [hasCard, setHasCard] = useState(false); // Track whether the user has a card
  const [createDonation, { isLoading, isError: isDonationError, error: donationError }] = useAddNewDonationMutation();


  const handleCreateDonation = () => {
    if (amount) {
      createDonation({ userId: id, amount: Number(amount) });
    }
  };

  return (
    <div>
      <h2>Donation Page</h2>
      <p>User: {username}</p>
      <div>
        <label htmlFor="amountInput">Amount:</label>
        <input
          type="number"
          id="amountInput"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      {isDonationError && <p>Error: {donationError.message}</p>}
      <button onClick={handleCreateDonation} disabled={isLoading}>
        Create Donation
      </button>
    </div>
  );
}

export default NewDonationForm;
