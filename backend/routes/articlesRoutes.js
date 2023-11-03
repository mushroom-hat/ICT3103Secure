const express = require('express')
const router = express.Router()
const articlesController = require('../controllers/articlesController')
const bouncerwritearticle = require('../middleware/bouncerwritearticle.js');

router.route('/')
    .get(articlesController.getAllArticles) // READ
    .post(bouncerwritearticle, articlesController.createNewArticle) // CREATE
    .patch(articlesController.updateArticle) // UPDATE
    .delete(articlesController.deleteArticle) // DELETE

module.exports = router