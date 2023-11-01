import React from "react";
import { useNavigate } from "react-router-dom";
import hopefulImg from "../../Assets/Organisation/HopefulHeartsFoundation.png";
import Card from "react-bootstrap/Card";

const OrganizationCard = ({ id, username }) => {
  const navigate = useNavigate();

  const mockDesc =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  const words = mockDesc.split(" ");
  const maxWords = 20;
  const truncatedDesc =
    words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : words.join(" ");

  const handleClick = () => navigate(`/organizations/${id}`);

  return (
    <Card className="project-card-view organization-card text-center" onClick={handleClick}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50%",
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
        <Card.Text style={{ textAlign: "justify" }}>{truncatedDesc}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default OrganizationCard;
