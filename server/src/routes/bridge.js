const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateRequest');
const { auth } = require('../middleware/auth');
const { initiateBridge, getBridgeTransactions, getBridgeStatus } = require('../controllers/bridgeController');

const router = express.Router();

/**
 * @route POST /api/bridge
 * @desc Initiate a bridge transaction
 * @access Private
 */
router.post(
  '/',
  auth,
  [
    body('sourceChainId').isInt().withMessage('Source chain ID is required'),
    body('destinationChainId').isInt().withMessage('Destination chain ID is required'),
    body('tokenSymbol').isString().withMessage('Token symbol is required'),
    body('amount').isNumeric().withMessage('Valid amount is required'),
    body('walletAddress').isString().withMessage('Wallet address is required'),
    body('destinationAddress').optional().isString().withMessage('Destination address must be a string'),
    validateRequest
  ],
  initiateBridge
);

/**
 * @route GET /api/bridge
 * @desc Get user's bridge transactions
 * @access Private
 */
router.get('/', auth, getBridgeTransactions);

/**
 * @route GET /api/bridge/:txId
 * @desc Get status of a specific bridge transaction
 * @access Private
 */
router.get('/:txId', auth, getBridgeStatus);

module.exports = router; 