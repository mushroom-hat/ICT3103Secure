const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')
const bouncersignup = require('../middleware/bouncersignup.js');


router.route('/')
    .get(verifyJWT, usersController.getAllUsers) //READ
    .post(verifyJWT, bouncersignup, usersController.createNewUsers) //CREATE
    .patch(verifyJWT, usersController.updateUser) //UPDATE
    .delete(verifyJWT, usersController.deleteUser) //DELETE

router.route('/organizations')
    .get(usersController.getAllOrganizations) //READ

router.route('/getUserById/:id')
    .get(usersController.getUserById);

router.route('/getUserByUsername')
    .post(usersController.getUserByUsername) // Add the route for getUserById

module.exports = router

