import React from "react";
import { useNavigate } from "react-router-dom";
import hopefulImg from "../../Assets/Organisation/HopefulHeartsFoundation.png";
import Card from "react-bootstrap/Card";

const OrganizationCard = ({ id, username }) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/organizations/${id}`);

  return (
    <Card className="project-card-view organization-card text-center" onClick={handleClick}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card.Img
          variant="top"
          src={hopefulImg}
          alt="card-img"
          style={{ maxWidth: "200px", maxHeight: "200px" }}
        />
      </div>
      <Card.Body>
        <Card.Title>{username}</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default OrganizationCard;
