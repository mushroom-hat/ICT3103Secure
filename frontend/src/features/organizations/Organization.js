import React from "react";
import { useParams } from "react-router-dom";
import { useGetOrganizationsQuery } from "../users/usersApiSlice";
import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Particle from "../../components/Particle";
import NavBar from "../../components/Navbar";
import hopefulImg from "../../Assets/Organisation/HopefulHeartsFoundation.png";

const Organization = () => {
  const {
    data: organizations,
    isLoading,
    isSuccess,
    isError,
  } = useGetOrganizationsQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { id } = useParams();
  const mockDesc =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) content = <p>Not Currently Available</p>;

  if (isSuccess) {
    const organization = organizations.find((org) => org.id === id);
    if (!organization) {
      content = <p>Organization not found.</p>;
    } else {
      content = (
        <Card className="project-card-view organization-card text-center">
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
            <Card.Title style={{ paddingBottom: "0.5rem" }}>
              {organization.username}
            </Card.Title>
            <Card.Text
              style={{ textAlign: "justify", paddingBottom: "0.5rem" }}
            >
              {mockDesc}
            </Card.Text>
          </Card.Body>
        </Card>
      );
    }
  }

  return (
    <Container fluid className="project-section">
      <Particle />
      <NavBar />
      <span>hey</span>
      <Container>{content}</Container>
    </Container>
  );
};

export default Organization;
