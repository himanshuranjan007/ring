/**
 * Logger utility for consistent logging across the application
 */

const winston = require('winston');
const path = require('path');

const { format, transports } = winston;
const { combine, timestamp, printf, colorize, errors } = format;

// Define log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Create a Winston logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Console transport for all environments
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
      )
    }),
    
    // File transport for production environment
    ...(process.env.NODE_ENV === 'production' ? [
      new transports.File({ 
        filename: path.join('logs', 'error.log'), 
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      }),
      new transports.File({ 
        filename: path.join('logs', 'combined.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ] : [])
  ]
});

// Add stream for Morgan integration
logger.stream = {
  write: (message) => logger.info(message.trim())
};

module.exports = logger; 