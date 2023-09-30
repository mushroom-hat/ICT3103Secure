import React from 'react';

const Article = ({ title, content }) => {
    return (
        <article className="article">
            <h3>{title}</h3>
            <p>{content}</p>
        </article>
    );
}

export default Article;
