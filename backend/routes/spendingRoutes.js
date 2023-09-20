const express = require('express')
const router = express.Router()
const spendingController = require('../controllers/spendingController')

router.route('/')
    .get(spendingController.getAllSpending) // READ
    .post(spendingController.createNewSpending) // CREATE
    .delete(spendingController.deleteSpending) // DELETE

module.exports = router
