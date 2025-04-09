/**
 * Configuration for supported chains
 */
const SUPPORTED_CHAINS = {
  // Mainnet chains
  1: {
    name: "Ethereum",
    rpc: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    explorer: "https://etherscan.io",
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    testnet: false,
  },
  42161: {
    name: "Arbitrum",
    rpc: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io",
    icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
    testnet: false,
  },
  8453: {
    name: "Base",
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    icon: "https://cryptologos.cc/logos/base-logo.png",
    testnet: false,
  },
  
  // Testnet chains
  5: {
    name: "Ethereum Goerli",
    rpc: "https://goerli.infura.io/v3/YOUR_INFURA_KEY",
    explorer: "https://goerli.etherscan.io",
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    testnet: true,
  },
  421613: {
    name: "Arbitrum Goerli",
    rpc: "https://goerli-rollup.arbitrum.io/rpc",
    explorer: "https://goerli.arbiscan.io",
    icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
    testnet: true,
  },
  84531: {
    name: "Base Goerli",
    rpc: "https://goerli.base.org",
    explorer: "https://goerli.basescan.org",
    icon: "https://cryptologos.cc/logos/base-logo.png",
    testnet: true,
  }
};

/**
 * Arweave destination chain configuration
 */
const ARWEAVE_CHAIN = {
  id: 'ARWEAVE',
  name: "Arweave",
  gateway: "https://arweave.net",
  explorer: "https://viewblock.io/arweave",
  icon: "https://cryptologos.cc/logos/arweave-ar-logo.png",
  testnet: false,
};

/**
 * Chain configuration utility for managing supported chains
 */

// Chain configuration map
const chainConfigs = {
  // Ethereum Mainnet
  1: {
    name: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrl: 'https://ethereum.rpc.example.com',
    blockExplorer: 'https://etherscan.io',
    bridgeable: true
  },
  // Arbitrum
  42161: {
    name: 'Arbitrum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrl: 'https://arbitrum.rpc.example.com',
    blockExplorer: 'https://arbiscan.io',
    bridgeable: true
  },
  // Base
  8453: {
    name: 'Base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrl: 'https://base.rpc.example.com',
    blockExplorer: 'https://basescan.org',
    bridgeable: true
  },
  // Optimism
  10: {
    name: 'Optimism',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrl: 'https://optimism.rpc.example.com',
    blockExplorer: 'https://optimistic.etherscan.io',
    bridgeable: true
  }
};

/**
 * Get all supported chains
 * @returns {Array} Array of chain configuration objects
 */
const getSupportedChains = () => {
  return Object.entries(chainConfigs).map(([chainId, config]) => ({
    chainId: parseInt(chainId),
    ...config
  }));
};

/**
 * Get bridgeable chains
 * @returns {Array} Array of bridgeable chain configuration objects
 */
const getBridgeableChains = () => {
  return getSupportedChains().filter(chain => chain.bridgeable);
};

/**
 * Get configuration for a specific chain
 * @param {number} chainId - Chain ID
 * @returns {Object|null} Chain configuration object or null if not found
 */
const getChainConfig = (chainId) => {
  if (!chainId || !chainConfigs[chainId]) {
    return null;
  }
  
  return {
    chainId: parseInt(chainId),
    ...chainConfigs[chainId]
  };
};

module.exports = {
  SUPPORTED_CHAINS,
  ARWEAVE_CHAIN,
  getSupportedChains,
  getBridgeableChains,
  getChainConfig
}; 