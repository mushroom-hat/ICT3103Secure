const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRole = require('../middleware/verifyRole')
const bouncersignup = require('../middleware/bouncersignup.js');


router.route('/')
    .get(verifyJWT,verifyRole(['Admin']),usersController.getAllUsers) //READ
    .post(verifyJWT,verifyRole(['Admin']), bouncersignup, usersController.createNewUsers) //CREATE
    .patch(verifyJWT,verifyRole(['Admin']), usersController.updateUser) //UPDATE
    .delete(verifyJWT,verifyRole(['Admin']), usersController.deleteUser) //DELETE

router.route('/organizations')
    .get(usersController.getAllOrganizations) //READ

router.route('/getUserById/:id')
    .get(usersController.getUserById);

router.route('/getUserByUsername')
    .post(verifyJWT,usersController.getUserByUsername) // Add the route for getUserById

module.exports = router

