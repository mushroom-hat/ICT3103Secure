import React, { useState } from "react";
import { useAddNewArticleMutation } from "./articlesApiSlice";
import useAuth from "../../hooks/useAuth";
import Particle from "../../components/Particle";
import Navbar from "../../components/Navbar";
import { Container, Form, Button, Alert } from "react-bootstrap";

function WriteArticle() {
  const { id: authorId } = useAuth(); // Retrieve the user's ID

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [addArticle, { isLoading, isError }] = useAddNewArticleMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === "" || content.trim() === "") {
      // Handle validation error
      return;
    }

    try {
      const newArticleData = {
        title,
        content,
        author: authorId, // Add the author's ID to the article data
      };

      await addArticle(newArticleData).unwrap();

      // Reset form fields
      setTitle("");
      setContent("");
    } catch (error) {
      // Handle error
      console.error("Error creating the article", error);
    }
  };

  return (
    <Container fluid className="project-section">
      <Particle />
      <Navbar />
      <Container>
        <h1 className="project-heading">Write a New Article</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Title:</Form.Label>
            <Form.Control
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Content:</Form.Label>
            <Form.Control
              as="textarea"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" disabled={isLoading} className="rounded-button">
            {isLoading ? "Publishing.." : "Publish"}
          </Button>
          {isError && <Alert variant="danger">Error publishing the article.</Alert>}
        </Form>
      </Container>
    </Container>
  );
}

export default WriteArticle;
