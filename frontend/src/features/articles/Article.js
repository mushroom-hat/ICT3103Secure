import React from "react";
import Card from "react-bootstrap/Card";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import Particle from "../../components/Particle";
import NavBar from "../../components/Navbar";
import { selectArticleById } from "./articlesApiSlice";

const Article = () => {
  // Get articleId from url params
  const { id } = useParams();
  const article = useSelector((state) => selectArticleById(state, id));

  // Convert date
  const rawDate = article.createdAt;
  const date = new Date(rawDate);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-SG", options);

  // console.log(article);
  return (
    <Container fluid className="project-section">
      <Particle />
      <NavBar />
      <Container>
        <Card className="project-card-view organization-card text-center">
          <Card.Body>
            <Card.Title style={{ paddingBottom: "0.5rem" }}>
              {article.title}
            </Card.Title>
            <Card.Text
              style={{ textAlign: "justify", paddingBottom: "0.5rem" }}
            >
              {article.content}
            </Card.Text>
            <Card.Text
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div>Organization: {article.author.username}</div>
              <div>Published: {formattedDate}</div>
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
};

export default Article;
