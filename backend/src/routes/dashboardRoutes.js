const express = require('express');
const { getSummary } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', authenticate, getSummary);

module.exports = router;
