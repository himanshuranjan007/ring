#!/bin/bash

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Creating .env file..."
  node setup.js
fi

# Start the server
npm start 