import React, { useState } from 'react';
import { useAddNewArticleMutation } from './articlesApitSlice';
import useAuth from "../../hooks/useAuth";

function WriteArticle() {
  const { id: authorId } = useAuth(); // Retrieve the user's ID

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [addArticle, { isLoading, isError }] = useAddNewArticleMutation();

  const handleSubmit = async () => {
    if (title.trim() === '' || content.trim() === '') {
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
      setTitle('');
      setContent('');
    } catch (error) {
      // Handle error
      console.error('Error creating the article', error);
    }
  };

  return (
    <div>
      <h2>Write Article</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Article'}
        </button>
        {isError && <div>Error adding the article.</div>}
      </form>
    </div>
  );
}

export default WriteArticle;