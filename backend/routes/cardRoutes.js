const express = require('express')
const router = express.Router()
const cardsController = require('../controllers/cardsController')

router.route('/')
    .get(cardsController.getAllCards) // READ
    .post(cardsController.createNewCard) // CREATE
    .patch(cardsController.updateCard) // UPDATE
    .delete(cardsController.deleteCard) // DELETE

module.exports = router