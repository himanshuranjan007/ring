/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tokens').del();
  
  // Insert seed entries
  await knex('tokens').insert([
    // Arbitrum Mainnet (42161)
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      chain_id: 42161,
      contract_address: null,
      is_active: true
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      chain_id: 42161,
      contract_address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      is_active: true
    },
    {
      symbol: 'ARB',
      name: 'Arbitrum',
      icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
      chain_id: 42161,
      contract_address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
      is_active: true
    },
    
    // Base Mainnet (8453)
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      chain_id: 8453,
      contract_address: null,
      is_active: true
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      chain_id: 8453,
      contract_address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      is_active: true
    },
    
    // Arbitrum Goerli Testnet (421613)
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      chain_id: 421613,
      contract_address: null,
      is_active: true
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      chain_id: 421613,
      contract_address: '0x75faf114eafb1bdbe2f0316df893fd58ce46aa4d',
      is_active: true
    },
    
    // Base Goerli Testnet (84531)
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      chain_id: 84531,
      contract_address: null,
      is_active: true
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      chain_id: 84531,
      contract_address: '0xf175520c52418dfe19c8098071a252da48cd1c19',
      is_active: true
    }
  ]);
}; 