const logger = require('../utils/logger');
const { getChainConfig } = require('../utils/chainConfig');
const Token = require('../models/Token');

/**
 * @desc Get supported tokens for a specific chain
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getSupportedTokens = async (req, res, next) => {
  try {
    const { chainId } = req.query;
    
    if (!chainId) {
      return res.status(400).json({
        success: false,
        error: 'Chain ID is required'
      });
    }
    
    // Convert chainId to number
    const chainIdNum = parseInt(chainId);
    
    // Check if chain is supported
    const chainConfig = getChainConfig(chainIdNum);
    if (!chainConfig) {
      return res.status(404).json({
        success: false,
        error: `Chain ID ${chainId} is not supported`
      });
    }
    
    // Fetch tokens from database
    const tokens = await Token.getByChainId(chainIdNum);
    
    const response = {
      chainId: chainIdNum,
      tokens: tokens
    };
    
    logger.info(`Retrieved ${tokens.length} tokens for chain ID: ${chainId}`);
    
    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    logger.error('Get supported tokens error:', error);
    next(error);
  }
};

/**
 * @desc Get current price for a token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getTokenPrice = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: 'Token symbol is required'
      });
    }
    
    // In a real implementation, we would fetch price data from an oracle or API
    // For this demo, we'll return mock data
    const mockPrices = {
      'ETH': { usd: '2000.50', change_24h: '2.5' },
      'USDC': { usd: '1.00', change_24h: '0.01' },
      'USDT': { usd: '1.00', change_24h: '0.00' },
      'ARB': { usd: '1.25', change_24h: '3.2' },
      'DAI': { usd: '1.00', change_24h: '0.05' },
    };
    
    const normalizedSymbol = symbol.toUpperCase();
    
    if (!mockPrices[normalizedSymbol]) {
      return res.status(404).json({
        success: false,
        error: `Token ${symbol} not found`
      });
    }
    
    logger.info(`Retrieved price for token: ${normalizedSymbol}`);
    
    res.status(200).json({
      success: true,
      data: {
        symbol: normalizedSymbol,
        price: mockPrices[normalizedSymbol]
      }
    });
  } catch (error) {
    logger.error('Get token price error:', error);
    next(error);
  }
};

module.exports = {
  getSupportedTokens,
  getTokenPrice
}; 