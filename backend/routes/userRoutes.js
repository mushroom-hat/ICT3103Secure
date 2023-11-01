const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')


router.route('/')
    .get(verifyJWT,usersController.getAllUsers) //READ
    .post(verifyJWT,usersController.createNewUsers) //CREATE
    .patch(verifyJWT,usersController.updateUser) //UPDATE
    .delete(verifyJWT,usersController.deleteUser) //DELETE
    .delete(verifyJWT,usersController.addDonationToUser)

router.route('/organizations')
.get(usersController.getAllOrganizations) //READ

module.exports = router
