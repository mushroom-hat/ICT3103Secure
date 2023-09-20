const express = require('express')
const router = express.Router()
const donationsController = require('../controllers/donationsController')

router.route('/')
    .get(donationsController.getAllDonations) // READ
    .post(donationsController.createNewDonation) // CREATE
    .patch(donationsController.deleteDonation) // DELETE

module.exports = router
