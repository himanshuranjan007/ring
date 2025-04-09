#!/bin/bash

# Terminal colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Ring Weave Bridge development environment...${NC}"

# Check if .env files exist, if not create them from examples
if [ ! -f "./server/.env" ]; then
  echo -e "${BLUE}Creating server .env file from example...${NC}"
  cp ./server/.env.example ./server/.env
fi

if [ ! -f "./client/.env" ]; then
  echo -e "${BLUE}Creating client .env file from example...${NC}"
  cp ./client/.env.example ./client/.env
fi

# Start backend in background
echo -e "${BLUE}Starting backend server...${NC}"
cd server && npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Start frontend
echo -e "${BLUE}Starting frontend client...${NC}"
cd ../client && npm run dev &
CLIENT_PID=$!

# Function to handle shutdown
cleanup() {
    echo -e "${GREEN}Shutting down services...${NC}"
    kill $SERVER_PID
    kill $CLIENT_PID
    exit 0
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

# Keep the script running
echo -e "${GREEN}Development environment running.${NC}"
echo -e "${GREEN}Press Ctrl+C to stop all services.${NC}"
wait 