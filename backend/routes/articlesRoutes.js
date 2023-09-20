const express = require('express')
const router = express.Router()
const articlesController = require('../controllers/articlesController')

router.route('/')
    .get(articlesController.getAllArticles) // READ
    .post(articlesController.createNewArticle) // CREATE
    .patch(articlesController.updateArticle) // UPDATE
    .delete(articlesController.deleteArticle) // DELETE

module.exports = router