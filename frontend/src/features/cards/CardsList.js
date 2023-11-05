import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  useDeleteCardMutation,
  useGetUserCardInfoQuery,
} from "./cardsApiSlice";
import NavBar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Container } from "react-bootstrap";
import "../../style.css";
import Particle from "../../components/Particle";
import { useGetUserByUsernameQuery } from '../users/usersApiSlice';
import { useSelector } from "react-redux";

const CardsList = () => {
  const { id, username } = useAuth();
  const navigate = useNavigate();

  const { data: userData, isLoading: isUserDataLoading, isError: isUserDataError, error: userDataError } = useGetUserByUsernameQuery(username);
  const { data: cardData, isLoading, isError } = useGetUserCardInfoQuery(id);
  const [deleteCard] = useDeleteCardMutation(); // Mutation hook for deleting a card

  const hasValidCard = userData && userData.card !== 'null';

  const handleDelete = async () => {
    try {
      // Assuming cardData.id is the ID of the card to be deleted
      await deleteCard({ id: cardData._id }).unwrap();
      // After successful deletion, you can refetch card data or update the UI
      window.location.reload();
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  return (
    <Container fluid className="project-section">
      <Particle />
      <NavBar />
      <Container style={{ position: "relative", zIndex: 1 }}>
        <h1 className="project-heading">View Your Cards</h1>
        {isError || !cardData ? (
          <div className="alert alert-warning" role="alert">
            No card found
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Card Number</th>
                <th>Card Holder Name</th>
                <th>Expiry Date</th>
                <th>CVC</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="table__cell">{cardData.cardNumber.slice(-4)}</td>
                <td className="table__cell">{cardData.cardHolderName}</td>
                <td className="table__cell">{cardData.expiryDate}</td>
                <td className="table__cell">{cardData.cvc}</td>
                <td className="table__cell">
                  <button
                    className="icon-button table__button"
                    onClick={handleDelete}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <Button variant="primary" disabled={hasValidCard} onClick={() => navigate("/dash/cards/new")}>
          Add Payment Method
        </Button>
      </Container>
    </Container>
  );
};

export default CardsList;
