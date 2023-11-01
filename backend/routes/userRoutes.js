const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(usersController.getAllUsers) //READ
    .post(usersController.createNewUsers) //CREATE
    .patch(usersController.updateUser) //UPDATE
    .delete(usersController.deleteUser) //DELETE
    .delete(usersController.addDonationToUser)

router.route('/organizations')
.get(usersController.getAllOrganizations) //READ

module.exports = router
