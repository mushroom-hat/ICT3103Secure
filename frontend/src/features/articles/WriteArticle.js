import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

const WriteArticle = () => {
    const [article, setArticle] = useState({
        title: '',
        content: '',
        imageLink: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setArticle(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Article submitted:", article); 
        // Here you can send the article to your backend server or handle as necessary
    };

    return (
        <div>
            <Navbar/>
            <div className="write-article">
                <h1>Write a New Article</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title:</label>
                        <input type="text" name="title" value={article.title} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Content:</label>
                        <textarea name="content" value={article.content} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Image Link (optional):</label>
                        <input type="text" name="imageLink" value={article.imageLink} onChange={handleInputChange} />
                    </div>
                    <button type="submit">Publish Article</button>
                </form>
            </div>
        </div>
    );
}

export default WriteArticle;
