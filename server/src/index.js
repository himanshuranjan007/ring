require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorHandler');
const bridgeRoutes = require('./routes/bridge');
const walletRoutes = require('./routes/wallet');
const tokenRoutes = require('./routes/tokens');
const logger = require('./utils/logger');
// const { errorMiddleware } = require('./middleware/errorMiddleware');
// const {errorMiddleware} = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      // Development origins
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      // Production origins - add your production domain(s) here
      process.env.CLIENT_URL,
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
  maxAge: 86400 // Cache preflight request for 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev', { stream: logger.stream }));

// Routes
app.use('/api/bridge', bridgeRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/tokens', tokenRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'operational',
    timestamp: new Date().toISOString() 
  });
});

// API status info
app.get('/api/status', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      apiVersion: '1.0.0',
      status: 'operational',
      uptime: process.uptime(),
      serverTime: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Error handling
app.use(errorHandler);

// Database connection
require('./config/database');

// Start server
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

module.exports = app; 