require('dotenv').config();
const db = require('../src/config/database');

async function checkConnection() {
  console.log('Testing database connection...');
  
  if (process.env.DATABASE_URL) {
    console.log(`Using database URL: ${process.env.DATABASE_URL}`);
  } else {
    console.log('Using individual connection parameters:');
    console.log(`   DB_HOST=${process.env.DB_HOST || 'localhost'}`);
    console.log(`   DB_PORT=${process.env.DB_PORT || '5432'}`);
    console.log(`   DB_USER=${process.env.DB_USER || 'postgres'}`);
    console.log(`   DB_NAME=${process.env.DB_NAME || 'ring_bridge'}`);
  }
  
  try {
    // Test simple query
    const result = await db.raw('SELECT version()');
    console.log('✅ Connection successful!');
    console.log('PostgreSQL version:', result.rows[0].version);
    
    // Check if tables exist
    const tables = await db.raw(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname='public'
    `);
    
    if (tables.rows.length === 0) {
      console.log('ℹ️ No tables found in database. Consider running migrations:');
      console.log('   npm run db:migrate');
      console.log('   npm run db:seed');
    } else {
      console.log('\n✅ Tables found in database:');
      tables.rows.forEach(row => {
        console.log(`   - ${row.tablename}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nPlease check your database configuration in .env:');
    
    if (process.env.DATABASE_URL) {
      console.error(`   DATABASE_URL=${process.env.DATABASE_URL}`);
    } else {
      console.error(`   DB_HOST=${process.env.DB_HOST || 'localhost'}`);
      console.error(`   DB_PORT=${process.env.DB_PORT || '5432'}`);
      console.error(`   DB_USER=${process.env.DB_USER || 'postgres'}`);
      console.error(`   DB_NAME=${process.env.DB_NAME || 'ring_bridge'}`);
    }
    
    console.error('\nMake sure PostgreSQL is running and the database exists.');
  } finally {
    // Close the connection
    db.destroy();
  }
}

checkConnection(); 