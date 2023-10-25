const express = require('express')
const router = express.Router()
const donationsController = require('../controllers/donationsController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRole = require('../middleware/verifyRole')

router.route('/')
    .get(donationsController.getAllDonations) // READ
    .post(verifyJWT,verifyRole(['Donator']),donationsController.createNewDonation) // CREATE
    .patch(donationsController.deleteDonation) // DELETE

module.exports = router
