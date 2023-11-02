import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useAddNewDonationMutation } from './donationsApiSlice';
import { useGetUserByIdQuery } from '../users/usersApiSlice';
import { useSelector } from "react-redux";

function NewDonationForm() {
  const { id, username } = useAuth();
  console.log(id);

  const [amount, setAmount] = useState('');
  const [createDonation, { isLoading, isError: isDonationError, error: donationError }] = useAddNewDonationMutation();
  const userId = id;
  console.log(userId);

  const { data: user, error: userError } = useGetUserByIdQuery(userId);
  console.log(user);
 
  if (user) {
    console.log('User data from Redux:', user);
  }

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
