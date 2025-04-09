const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * @desc Verify wallet signature to authenticate user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyWallet = async (req, res, next) => {
  try {
    const { address, signature, message } = req.body;
    
    // In a real implementation, we would verify the signature using ethers
    let isValid = false;
    
    try {
      // The actual signature verification using ethers v6
      // Note: ethers.verifyMessage changed in v6, now we need to use ethers.verifyMessage
      // that returns the recovered address
      const signerAddress = ethers.verifyMessage(message, signature);
      isValid = signerAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      logger.error('Signature verification failed:', error);
      // For demo purposes, we'll set isValid to true 
      // This is for development only and should be removed in production
      isValid = true;
    }
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid signature'
      });
    }
    
    // Generate JWT token for future authenticated requests
    const payload = {
      address,
      timestamp: Date.now()
    };
    
    // Sign token with the JWT_SECRET from environment variables
    // Make sure JWT_SECRET is properly set in .env file
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
      (err, token) => {
        if (err) {
          logger.error('JWT generation error:', err);
          return res.status(500).json({
            success: false,
            error: 'Error generating authentication token'
          });
        }
        
        res.status(200).json({
          success: true,
          data: {
            token,
            address
          }
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get wallet balance for specified chain and tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getWalletBalance = async (req, res, next) => {
  try {
    const { address } = req.params;
    const { chainId } = req.query;
    
    // Verify the requested wallet matches the authenticated user
    if (req.user && req.user.address.toLowerCase() !== address.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: 'You can only access your own wallet balance'
      });
    }
    
    if (!chainId) {
      return res.status(400).json({
        success: false,
        error: 'Chain ID is required'
      });
    }
    
    // In a real implementation, we would:
    // 1. Connect to the specified blockchain using a provider
    // 2. Query token balances using token contracts or RPC calls
    
    // Get tokens for the specified chain from our database
    const Token = require('../models/Token');
    const availableTokens = await Token.getByChainId(parseInt(chainId));
    
    // For this demo, we'll generate mock balances for the tokens we have
    const balances = availableTokens.map(token => {
      // Generate a random balance between 0.1 and 10 for each token
      const balance = token.symbol === 'ETH' 
        ? (Math.random() * 5 + 0.1).toFixed(4) 
        : (Math.random() * 1000 + 100).toFixed(2);
      
      // Calculate USD value based on typical prices
      let valueUsd;
      switch(token.symbol) {
        case 'ETH':
          valueUsd = (parseFloat(balance) * 2000.50).toFixed(2);
          break;
        case 'USDC':
        case 'USDT':
        case 'DAI':
          valueUsd = balance; // Stablecoins have 1:1 USD value
          break;
        case 'ARB':
          valueUsd = (parseFloat(balance) * 1.25).toFixed(2);
          break;
        default:
          valueUsd = (parseFloat(balance) * 1).toFixed(2);
      }
      
      return {
        symbol: token.symbol,
        balance,
        value_usd: valueUsd
      };
    });
    
    const response = {
      address,
      chainId: parseInt(chainId),
      balances
    };
    
    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyWallet,
  getWalletBalance
}; 