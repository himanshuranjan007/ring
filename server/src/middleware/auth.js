const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Authentication middleware to protect routes
 */
const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  
  // Check if no token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'No token, authorization denied'
    });
  }
  
  // Extract token
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload to request object
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    
    return res.status(401).json({
      success: false,
      error: 'Token is not valid'
    });
  }
};

module.exports = { auth }; 