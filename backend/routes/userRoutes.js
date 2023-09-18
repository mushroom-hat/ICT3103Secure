const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

router.route('/')
    .get(usersController.getAllUsers) //READ
    .post(usersController.createNewUsers) //CREATE
    .patch(usersController.updateUser) //UPDATE
    .delete(usersController.deleteUser) //DELETE

module.exports = router