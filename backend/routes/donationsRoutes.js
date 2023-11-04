const express = require('express')
const router = express.Router()
const donationsController = require('../controllers/donationsController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRole = require('../middleware/verifyRole')
const bouncerdonation = require('../middleware/bouncerdonation.js');

router.route('/')
    .get(donationsController.getAllDonations) // READ
    .post(verifyJWT,verifyRole(['Donator']), bouncerdonation, donationsController.createNewDonation) // CREATE
    .patch(donationsController.deleteDonation) // DELETE

router.post('/getByOrg', donationsController.getDonationsByOrganization);

module.exports = router
