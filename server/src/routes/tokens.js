const express = require('express');
const { getSupportedTokens, getTokenPrice } = require('../controllers/tokenController');

const router = express.Router();

/**
 * @route GET /api/tokens
 * @desc Get supported tokens for a specific chain
 * @access Public
 */
router.get('/', getSupportedTokens);

/**
 * @route GET /api/tokens/price/:symbol
 * @desc Get current price for a token
 * @access Public
 */
router.get('/price/:symbol', getTokenPrice);

module.exports = router; 