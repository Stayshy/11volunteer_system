const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/reports', reportController.getReports);
router.get('/statistics/:id', reportController.getStats);
router.post('/reports', reportController.createReport);

module.exports = router;