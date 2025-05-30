const express = require('express');
const router = express.Router();
const participationController = require('../controllers/participationController');

router.post('/participations', participationController.createParticipation);
router.delete('/participations', participationController.deleteParticipation);

module.exports = router;