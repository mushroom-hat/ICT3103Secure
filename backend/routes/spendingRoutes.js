const express = require('express')
const router = express.Router()
const spendingController = require('../controllers/spendingController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRole = require('../middleware/verifyRole')

router.route('/')
    .get(verifyJWT,verifyRole(['Admin']),spendingController.getAllSpending) // READ
    .post(verifyJWT,verifyRole(['Organization']),verifyJWT,spendingController.createNewSpending) // CREATE
    .delete(verifyJWT,verifyRole(['Admin']),spendingController.deleteSpending) // DELETE

    router.post('/getByOrg', verifyJWT,verifyRole(['Organization']), spendingController.getSpendingByOrganization);

module.exports = router
