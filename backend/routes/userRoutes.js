const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')


router.route('/')
    .get(verifyJWT,usersController.getAllUsers) //READ
    .post(verifyJWT,usersController.createNewUsers) //CREATE
    .patch(verifyJWT,usersController.updateUser) //UPDATE
    .delete(verifyJWT,usersController.deleteUser) //DELETE

router.route('/organizations')
.get(usersController.getAllOrganizations) //READ

.router.route('/getById')
.get(usersController.getUserById) // Add the route for getUserById

module.exports = router

