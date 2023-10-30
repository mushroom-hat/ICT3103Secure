import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectArticleById } from "./articlesApiSlice";

const ArticleRow = ({ articleId }) => {
  const article = useSelector((state) => selectArticleById(state, articleId));
  const navigate = useNavigate();

  const words = article.content.split(" ");
  const maxWords = 20;const truncatedContent =
    words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : words.join(" ");

  const handleClick = () => navigate(`/article/${articleId}`);
  
  return (
    <tr className="table__row article" onClick={handleClick}>
      <td className="table__cell">{article.author.username}</td>
      <td className="table__cell">{article.title}</td>
      <td className="table__cell">{truncatedContent}</td>
    </tr>
  );
};

export default ArticleRow;
