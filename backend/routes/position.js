const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getUserPositions, saveUserPositions } = require('../services/positionService');
const { getUser, saveUser } = require('../services/userService');
const { sendPositionOpenEmail, sendPositionClosedEmail, sendPositionTPEmail, sendPositionSLEmail } = require('../utils/email');
const { fetchCurrentMarketPrices } = require('../utils/market');
const router = express.Router();

module.exports = router;