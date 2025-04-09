const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateRequest');
const { auth } = require('../middleware/auth');
const { verifyWallet, getWalletBalance } = require('../controllers/walletController');

const router = express.Router();

/**
 * @route POST /api/wallet/verify
 * @desc Verify wallet signature
 * @access Public
 */
router.post(
  '/verify',
  [
    body('address').isString().withMessage('Wallet address is required'),
    body('signature').isString().withMessage('Signature is required'),
    body('message').isString().withMessage('Message is required'),
    validateRequest
  ],
  verifyWallet
);

/**
 * @route GET /api/wallet/balance/:address
 * @desc Get wallet balance for a chain and token
 * @access Private
 */
router.get(
  '/balance/:address',
  auth,
  getWalletBalance
);

module.exports = router; 