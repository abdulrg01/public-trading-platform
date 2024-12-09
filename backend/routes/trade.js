const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getUserPositions, saveUserPositions } = require('../services/positionService');
const { sendFuturesLimitSucceedEmail } = require('../utils/email');

const router = express.Router();

module.exports = router;