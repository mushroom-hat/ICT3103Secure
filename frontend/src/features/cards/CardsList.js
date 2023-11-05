import React, { useState } from "react";
import { useGetCardsQuery } from "./cardsApiSlice";
import Card from "./Card";
import NavBar from "../../components/Navbar";
import Particle from "../../components/Particle";
import { Container, Col, Row, Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../style.css"; // Import your custom CSS for styling
import useAuth from '../../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { useGetUserByUsernameQuery } from '../users/usersApiSlice';
const CardsList = () => {
  const {
    data: cards,
    isLoading,
    isSuccess,
    isError,
  } = useGetCardsQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const { id, username } = useAuth();
  const { data: userData, isLoading: isUserDataLoading, isError: isUserDataError, error: userDataError } = useGetUserByUsernameQuery(username);

  const hasValidCard = userData && userData?.card !== null;
  console.log("Card", userData?.card)
  console.log(hasValidCard)
  console.log(!hasValidCard)
  console.log()
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/dash/cards/new");
  };
  let content;

  if (isLoading) content = <p>Loading...</p>;
  if (isError) content = <p>Not Currently Available</p>;
  
  if (isSuccess) {
    const { ids, entities } = cards;
    const filteredIds = ids.filter((id) => {
      const card = entities[id];
      return (
        (card.cardNumber?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
        (card.cardHolderName?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
        (card.expiryDate?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
        (card.cvc?.toLowerCase() ?? "").includes(searchQuery.toLowerCase())
      );
    });

    content = (
      <>
        <NavBar />
        <Container fluid className="home-section" id="home">
          <Particle />
          <Container>
            <Row>
              <Col md={7} className="home-header">
                <h1 style={{ paddingBottom: 15, color: "white" }} className="heading">
                  Payment Methods
                </h1>
              </Col>
            </Row>
          </Container>
        </Container>
        <Container>
          <Row className="justify-content-md-center" style={{ paddingBottom: "1rem"}}>
              <Form.Group as={Row} controlId="searchQuery">
                <Col sm={3}>
                <Button
                  variant="primary"
                  disabled={hasValidCard}
                  onClick={() => {
                    handleAdd();
                  }}
                >
    Add Payment Method
  </Button>
                </Col>
                <Col sm={9} style={{ display: "flex", alignItems: "center"}}>
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Col>
              </Form.Group>
          </Row>
          <Row className="justify-content-md-center">
            <Col sm={12}>
              <div className="payment-methods-list">
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
                    {filteredIds.map((cardId) => (
                      <tr key={cardId}>
                        <Card cardId={cardId} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return content;
};

export default CardsList;
