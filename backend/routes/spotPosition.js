const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { fetchCurrentMarketPrices } = require('../utils/market');
const { getUser, saveUser } = require('../services/userService');
const { sendTokenBuyEmail, sendTokenSellEmail } = require('../utils/email');
const router = express.Router();

module.exports = router;