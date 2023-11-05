const express = require('express')
const router = express.Router()
const cardsController = require('../controllers/cardsController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRole = require('../middleware/verifyRole')

router.route('/')
    .get(verifyJWT,verifyRole(['Admin']),cardsController.getAllCards) // READ
    .post(verifyJWT,verifyRole(['Donator']),cardsController.createNewCard) // CREATE
    .patch(verifyJWT,verifyRole(['Admin']),cardsController.updateCard) // UPDATE
    .delete(verifyJWT,verifyRole(['Donator']),cardsController.deleteCard) // DELETE

module.exports = router