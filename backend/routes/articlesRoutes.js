const express = require('express')
const router = express.Router()
const articlesController = require('../controllers/articlesController')
const bouncerwritearticle = require('../middleware/bouncerwritearticle.js');
const verifyJWT = require('../middleware/verifyJWT')
const verifyRole = require('../middleware/verifyRole')

router.route('/')
    .get(articlesController.getAllArticles) // READ
    .post(verifyJWT,verifyRole(['Organization']),bouncerwritearticle, articlesController.createNewArticle) // CREATE
    .patch(verifyJWT,verifyRole(['Organization']),articlesController.updateArticle) // UPDATE
    .delete(verifyJWT,verifyRole(['Organization']),articlesController.deleteArticle) // DELETE

module.exports = router