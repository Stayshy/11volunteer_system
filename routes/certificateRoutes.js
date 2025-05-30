const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');

router.get('/certificate', certificateController.getCertificate);

module.exports = router;