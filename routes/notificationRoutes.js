const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/notify', notificationController.send);

module.exports = router;