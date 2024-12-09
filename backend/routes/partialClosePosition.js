const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { partialClosePosition } = require('../services/partialClosePositionService');
const router = express.Router();

module.exports = router;