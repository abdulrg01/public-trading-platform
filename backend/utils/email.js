const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({});

function transporterSendMail(mailOptions) {}

function sendWithdrawalEmail(username, address, amount) {}

function sendPositionOpenEmail(username, position) {}

function sendPositionTPEmail(username, position) {}

function sendTokenSellEmail(username, position, exitPrice, assetType, amount) {}

function sendTokenBuyEmail(username, position, exitPrice, assetType, amount) {}

function sendSpotLimitSucceedEmail(username, position, currentPrice) {}

function sendFuturesLimitSucceedEmail(username, position) {}

function sendPositionSLEmail(username, position) {}

function sendPositionClosedEmail(username, position, exitPrice) {}

function sendPositionPartialClosedEmail(username, position, exitPrice) {}

module.exports = {
    sendWithdrawalEmail,

    sendPositionOpenEmail,
    sendPositionTPEmail,
    sendPositionSLEmail,
    sendPositionClosedEmail,
    sendPositionPartialClosedEmail,
    sendTokenBuyEmail,
    sendTokenSellEmail,
    sendSpotLimitSucceedEmail,
    sendFuturesLimitSucceedEmail
};