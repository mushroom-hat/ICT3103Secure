import React, { useState } from "react";
import { useAddNewArticleMutation } from "./articlesApiSlice";
import useAuth from "../../hooks/useAuth";
import Particle from "../../components/Particle";
import NavBar from "../../components/Navbar";
import { Container } from "react-bootstrap";

function WriteArticle() {
  const { id: authorId } = useAuth(); // Retrieve the user's ID

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [addArticle, { isLoading, isError }] = useAddNewArticleMutation();

  const handleSubmit = async () => {
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
      <NavBar />
      <Container>
        <h1 className="project-heading">Write a new Article</h1>
        <form
          onSubmit={handleSubmit}
          style={{ position: "relative", paddingBottom: "0.5rem" }}
        >
          <div style={{ paddingBottom: "0.5rem" }}>
            <label
              htmlFor="title"
              style={{ color: "white", paddingRight: "0.5rem" }}
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ zIndex: 1, position: "relative" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", paddingBottom: "0.5rem" }}>
            <label
              htmlFor="content"
              style={{ color: "white" }}
            >
              Content:
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button type="submit" disabled={isLoading} className="rounded-button">
            {isLoading ? "Publishing.." : "Publish"}
          </button>
          {isError && <div>Error publishing the article.</div>}
        </form>
      </Container>
    </Container>
  );
}

export default WriteArticle;