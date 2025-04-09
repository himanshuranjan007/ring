# Ring Weave Bridge Server

Backend service for the Ring Weave Bridge application that facilitates bridging assets between Ethereum-based chains (Arbitrum, Base) and Arweave.

## Features

- REST API for bridge operations
- Wallet integration and authentication
- Token balance and price information
- Transaction status tracking
- PostgreSQL database integration for data persistence

## Setup

1. Clone the repository
2. Navigate to the server directory:
   ```
   cd server
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
5. Update the `.env` file with your own configuration values
6. Ensure PostgreSQL is running and create a database:
   ```
   createdb ring_bridge
   ```
7. Run database migrations and seed data:
   ```
   npm run db:migrate
   npm run db:seed
   ```

## Database Management

- Run migrations: `npm run db:migrate`
- Rollback migrations: `npm run db:rollback`
- Seed database: `npm run db:seed`

## Development

Run the server in development mode with auto-reload:

```
npm run dev
```

## Production

Start the server in production mode:

```
npm start
```

## API Endpoints

### Bridge Operations

- `POST /api/bridge` - Initiate a bridge transaction
- `GET /api/bridge` - Get all bridge transactions for a user
- `GET /api/bridge/:txId` - Get status of a specific bridge transaction

### Wallet Operations

- `POST /api/wallet/verify` - Verify wallet signature
- `GET /api/wallet/balance/:address` - Get wallet balance for a chain and token

### Token Operations

- `GET /api/tokens` - Get supported tokens for a specific chain
- `GET /api/tokens/price/:symbol` - Get current price for a token

## License

[MIT](../LICENSE) 