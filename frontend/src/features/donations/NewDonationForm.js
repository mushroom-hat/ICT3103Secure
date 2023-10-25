import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth'; // Import the useAuth hook
import { useAddNewDonationMutation } from './donationsApiSlice';

function NewDonationForm() {
  const { id, username } = useAuth(); // Get the user's ID and username from the useAuth hook
  const [amount, setAmount] = useState('');
  const [createDonation, { isLoading, isError, error }] = useAddNewDonationMutation();

  const handleCreateDonation = () => {
    if (amount) {
      // Send a POST request to create a new donation
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
      {isError && <p>Error: {error.message}</p>}
      <button onClick={handleCreateDonation} disabled={isLoading}>
        Create Donation
      </button>
    </div>
  );
}

export default NewDonationForm;
