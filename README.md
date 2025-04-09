# Ring Weave Bridge

A decentralized bridge application that allows users to transfer assets between Ethereum-based chains (Arbitrum, Base) and Arweave.

## Overview

Ring Weave Bridge provides a seamless user experience for bridging digital assets across different blockchains. The application consists of:

- **Frontend**: A React application built with TypeScript, Tailwind CSS, and Vite
- **Backend**: A Node.js/Express server that handles API requests and blockchain interactions

## Features

- Connect Web3 wallets (MetaMask)
- Authentication using wallet signatures
- Bridge assets between Ethereum-based chains and Arweave
- View transaction history and status
- Real-time API health monitoring

## Prerequisites

- Node.js 16+ and npm/yarn
- MetaMask or compatible wallet extension

## Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/ring-weave-bridge.git
cd ring-weave-bridge
```

### Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Configure environment variables

Both the client and server have `.env.example` files that should be copied to `.env`:

```bash
# Server environment setup
cp server/.env.example server/.env

# Client environment setup
cp client/.env.example client/.env
```

Edit these files to configure your specific environment settings.

### Start development environment

The project includes a convenient script to start both the frontend and backend services:

```bash
# Make the script executable (if needed)
chmod +x start-dev.sh

# Start the development environment
./start-dev.sh
```

Alternatively, you can start each service separately:

```bash
# Start the backend
cd server
npm run dev

# Start the frontend (in a different terminal)
cd client
npm run dev
```

## Architecture

- **Client**: React, TypeScript, TailwindCSS
- **Server**: Node.js, Express
- **Authentication**: JWT (JSON Web Tokens)
- **Blockchain integration**: Ethers.js

## Folder Structure

```
ring-weave-bridge/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Web3, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API services
│   │   └── ...
├── server/                 # Backend Node.js application
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions and helpers
│   │   └── ...
└── ...
```

## License

[MIT](LICENSE) 