const { ethers } = require('ethers');
const logger = require('../utils/logger');
const BridgeTransaction = require('../models/BridgeTransaction');
const BridgeStep = require('../models/BridgeStep');

/**
 * @desc Initiate a bridge transaction
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const initiateBridge = async (req, res, next) => {
  try {
    const { sourceChainId, destinationChainId, tokenSymbol, amount, walletAddress, destinationAddress } = req.body;
    
    // Validate input
    if (!sourceChainId || !destinationChainId || !tokenSymbol || !amount || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields for bridge transaction'
      });
    }
    
    // In a real implementation, we would:
    // 1. Verify the user has sufficient balance
    // 2. Calculate bridge fees
    // 3. Lock tokens on source chain
    // 4. Initiate the cross-chain transaction
    
    // For this demo, we'll create a transaction in our database
    const txId = `tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // Create the transaction
    const transaction = await BridgeTransaction.create({
      txId,
      sourceChainId: parseInt(sourceChainId),
      destinationChainId: parseInt(destinationChainId),
      tokenSymbol,
      amount,
      walletAddress,
      destinationAddress: destinationAddress || null,
      status: 'pending',
      timestamp: new Date().toISOString(),
      estimatedCompletionTime: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes from now
    });
    
    // Create the transaction steps
    await BridgeStep.createSteps(txId, [
      { name: 'Initiation', status: 'completed' },
      { name: 'Source Chain Confirmation', status: 'pending' },
      { name: 'Destination Chain Processing', status: 'pending' },
      { name: 'Completion', status: 'pending' }
    ]);
    
    logger.info(`Bridge transaction initiated: ${JSON.stringify(transaction)}`);
    
    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    logger.error('Bridge transaction error:', error);
    next(error);
  }
};

/**
 * @desc Get all bridge transactions for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getBridgeTransactions = async (req, res, next) => {
  try {
    const walletAddress = req.query.address || (req.user && req.user.address);
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }
    
    // Get transactions from database
    const transactions = await BridgeTransaction.getByWalletAddress(walletAddress);
    
    logger.info(`Retrieved ${transactions.length} transactions for wallet: ${walletAddress}`);
    
    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    logger.error('Get transactions error:', error);
    next(error);
  }
};

/**
 * @desc Get status of a specific bridge transaction
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getBridgeStatus = async (req, res, next) => {
  try {
    const { txId } = req.params;
    
    if (!txId) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID is required'
      });
    }
    
    // Get transaction with steps from database
    const transaction = await BridgeTransaction.getWithSteps(txId);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    logger.info(`Retrieved status for transaction: ${txId}`);
    
    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    logger.error('Get transaction status error:', error);
    next(error);
  }
};

module.exports = {
  initiateBridge,
  getBridgeTransactions,
  getBridgeStatus
}; 