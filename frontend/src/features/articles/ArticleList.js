import React from "react";
import { Container } from "react-bootstrap";
import ArticleRow from "./ArticleRow";
import { useGetArticlesQuery } from "./articlesApiSlice";

const ArticleList = () => {
  const {
    data: articles,
    isLoading,
    isSuccess,
    isError,
  } = useGetArticlesQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) content = <p>Not Currently Available</p>;

  if (isSuccess) {
    const { ids } = articles;
    const tableContent = ids?.length
      ? ids.map((articleId) => (
          <ArticleRow key={articleId} articleId={articleId} />
        ))
      : null;

    content = (
      <Container fluid className="home-about-section">
        <Container>
          <h1 className="project-heading">Articles</h1>
          <table className="table table--articles">
            <thead className="table__thead">
              <tr>
                <th scope="col" className="table__th article__title">
                  Organization
                </th>
                <th scope="col" className="table__th article__title">
                  Title
                </th>
                <th scope="col" className="table__th article__title">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </Container>
      </Container>
    );
  }

  return content;
};

export default ArticleList;
