const Article = require('../models/Article');
const User = require('../models/User'); // Import the User model
const asyncHandler = require('express-async-handler');

//@desc Get all articles
//@route GET /articles
//@access Public
const getAllArticles = asyncHandler(async (req, res) => {
    const articles = await Article.find().populate('author', 'username').lean();
    if (!articles || articles.length === 0) {
        return res.status(404).json({ message: 'No articles found' });
    }
    res.json(articles);
});

//@desc Create a new article
//@route POST /articles
//@access Private
const createNewArticle = asyncHandler(async (req, res) => {
    console.log("this is the right path zh")
    const { title, content, author } = req.body;

    // Confirm data
    if (!title || !content || !author) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the author exists
    const user = await User.findById(author).exec();

    if (!user) {
        return res.status(400).json({ message: 'Author not found' });
    }

    // Create and store the new article
    const article = await Article.create({ title, content, author });

    if (article) {
        res.status(201).json({ message: 'New article created' });
    } else {
        res.status(400).json({ message: 'Invalid article data received' });
    }
});

//@desc Update an article
//@route PUT /articles/:id
//@access Private
const updateArticle = asyncHandler(async (req, res) => {
    const { _id, title, content } = req.body;

    // Check if the article exists
    const article = await Article.findById(_id).exec();

    if (!article) {
        return res.status(400).json({ message: 'Article not found' });
    }

    // Update article fields if provided in the request body
    if (title) {
        article.title = title;
    }
    if (content) {
        article.content = content;
    }

    const updatedArticle = await article.save();

    res.json({ message: 'Article updated' });
});

//@desc Delete an article
//@route DELETE /articles/:id
//@access Private
const deleteArticle = asyncHandler(async (req, res) => {
    const { _id } = req.body;

    // Check if the article exists
    const article = await Article.findById(_id).exec();

    if (!article) {
        return res.status(400).json({ message: 'Article not found' });
    }

    const result = await article.deleteOne();
    const reply = `Article with ID ${result._id} deleted`;
    res.json(reply);
});

module.exports = {
    getAllArticles,
    createNewArticle,
    updateArticle,
    deleteArticle,
};
