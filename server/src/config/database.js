require('dotenv').config();
const knex = require('knex');

// Database configuration
const dbConfig = {
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'ring_bridge',
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: '../migrations'
  }
};

// Initialize knex with the configuration
const db = knex(dbConfig);

// Test the connection
db.raw('SELECT 1')
  .then(() => {
    console.log('Database connection established successfully');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

module.exports = db; 