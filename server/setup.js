const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Check if .env file already exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (fs.existsSync(envPath)) {
  console.log('.env file already exists. Skipping creation.');
  process.exit(0);
}

// Read .env.example file
if (!fs.existsSync(envExamplePath)) {
  console.error('.env.example file not found. Cannot create .env file.');
  process.exit(1);
}

// Generate a random JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Read the example file
let envContent = fs.readFileSync(envExamplePath, 'utf8');

// Replace the JWT secret
envContent = envContent.replace('JWT_SECRET=your_jwt_secret_key', `JWT_SECRET=${jwtSecret}`);

// Write the new .env file
fs.writeFileSync(envPath, envContent);

console.log('.env file created successfully with a random JWT secret.');
console.log('You may need to update other configuration values in the .env file.'); 