const express = require('express')
const router = express.Router()
const donationsController = require('../controllers/donationsController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRole = require('../middleware/verifyRole')
const bouncerdonation = require('../middleware/bouncerdonation.js');

router.route('/')
    .get(verifyJWT,verifyRole(['Admin']),donationsController.getAllDonations) // READ
    .post(verifyJWT,verifyRole(['Donator']), bouncerdonation, donationsController.createNewDonation) // CREATE
    .patch(verifyJWT,verifyRole(['Donator']),donationsController.deleteDonation) // DELETE

router.post('/getByOrg', verifyJWT,verifyRole(['Donator']),donationsController.getDonationsByOrganization);

module.exports = router
