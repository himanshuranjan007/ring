const { validationResult } = require('express-validator');

/**
 * Middleware to validate request inputs
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      })) 
    });
  }
  next();
};

module.exports = { validateRequest }; 