const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { updateValue } = require('../services/updateValueService');
const router = express.Router();

module.exports = router;