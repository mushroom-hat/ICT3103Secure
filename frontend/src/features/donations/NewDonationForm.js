import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useAddNewDonationMutation } from './donationsApiSlice';
import { useGetUserByUsernameQuery } from '../users/usersApiSlice';
import { useSelector } from "react-redux";
import Particle from "../../components/Particle";
import { Container } from "react-bootstrap";
import NavBar from "../../components/Navbar";
import { useGetOrganizationsQuery } from '../users/usersApiSlice';
import { useNavigate } from 'react-router-dom';

function NewDonationForm() {
  const { id, username } = useAuth();
  const { data: userData, isLoading: isUserDataLoading, isError: isUserDataError, error: userDataError } = useGetUserByUsernameQuery(username);
  const [amount, setAmount] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [createDonation, { isLoading, isError: isDonationError, error: donationError }] = useAddNewDonationMutation();
  const navigate = useNavigate();

  const organizationsQuery = useGetOrganizationsQuery(); // Fetch organization data

  if (isUserDataLoading || organizationsQuery.isLoading) {
    // Render a loading message or spinner while fetching data
    return <p>Loading...</p>;
  }

  if (isUserDataError) {
    // Handle the error if user data retrieval fails
    return <p>Error: {userDataError.message}</p>;
  }

  if (organizationsQuery.isError) {
    // Handle the error if organization data retrieval fails
    return <p>Error: {organizationsQuery.error.message}</p>;
  }

  const organizations = organizationsQuery.data; // Access the organization data

  const handleCreateDonation = () => {
    console.log("Button clicked");

    if (amount && userData?.card !== null && selectedOrganization) {
      console.log("Amount, card data, and organization are valid");
      createDonation({ userId: id, amount: amount, organizationId: selectedOrganization });
    } else {
      console.log("Amount, card data, or organization are invalid");
      navigate("/dash/cards/new");
    }
  }

  return (
    <Container fluid className="project-section">
      <Particle />
      <NavBar />
      <Container>
        <h1 className="project-heading">Make a Donation!</h1>
        <p style={{ color: "white" }}>You are logged in as: {username}</p>
        
        <div style={{ position: "relative", paddingBottom: "0.5rem" }}>
          <label htmlFor="amountInput" style={{ color: "white", paddingRight: "0.5rem" }}>
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
        
        <div style={{ position: "relative", paddingBottom: "0.5rem" }}>
          <label htmlFor="organizationDropdown" style={{ color: "white", paddingRight: "0.5rem" }}>
            Choose an organization:
          </label>
          <select
            id="organizationDropdown"
            value={selectedOrganization}
            onChange={(e) => setSelectedOrganization(e.target.value)}
          >
            <option value="">Select an organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.username}
              </option>
            ))}
          </select>
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
