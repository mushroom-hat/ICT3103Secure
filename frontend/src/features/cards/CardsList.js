import React, { useState } from "react";
import { useGetCardsQuery } from "./cardsApiSlice";
import Card from "./Card";
import NavBar from "../../components/Navbar";
import Particle from "../../components/Particle";
import { Container, Col, Row, Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../style.css"; // Import your custom CSS for styling

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

  const [searchQuery, setSearchQuery] = useState("");

  let content;

  const handleDelete = (cardId) => {
    // Handle the card deletion logic here
    // You can show a confirmation dialog or directly delete the card
  };

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
          <Row className="justify-content-md-center">
            <Col sm={8} md={8} lg={8} style={{ padding: "20px" }}>
              <Form.Group as={Row} controlId="searchQuery">
                <Col sm={2}>
                  <Link to="/dash/cards/new">
                    <Button variant="primary">Add Payment Method</Button>
                  </Link>
                </Col>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Col>
              </Form.Group>
            </Col>
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
                        <td>
                          <Button variant="danger" onClick={() => handleDelete(cardId)}>Delete</Button>
                        </td>
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
