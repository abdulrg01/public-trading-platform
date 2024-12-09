const { getAllUsers, saveUser } = require('../services/userService');
const { getUserPositions, saveUserPositions, saveUserSpotPositions } = require('./positionService');
const { fetchCurrentMarketPrices } = require('../utils/market');
const { sendTokenBuyEmail, sendTokenSellEmail, sendWithdrawalEmail, sendSpotLimitSucceedEmail } = require('../utils/email');
const { getUserBalance, updateUserBalance } = require('../services/balanceService');

async function startCheckingOrderService() {
    console.log('Checking orders service started...');
}

module.exports = { startCheckingOrderService };