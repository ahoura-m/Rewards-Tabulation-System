const express = require('express')
const router = express.Router()
const mainController = require('../controllers/mainController.js')

// App Routers
router.get('/balance',mainController.balance)
router.post('/add-tx', mainController.addTx)
router.post('/spend',mainController.spend)

module.exports = router