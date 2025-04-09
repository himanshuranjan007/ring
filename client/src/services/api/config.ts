/**
 * API Configuration for Ring Weave Bridge
 */

// Define environment-based API URL
const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default fallback (assumes backend is running on same host in development)
  return import.meta.env.DEV 
    ? 'http://localhost:3001/api'
    : '/api';
};

export const API_BASE_URL = getApiBaseUrl();

// API Endpoints
export const ENDPOINTS = {
  // Health check
  HEALTH: '/health',
  
  // Bridge operations
  BRIDGE: '/bridge',
  BRIDGE_STATUS: (txId: string) => `/bridge/${txId}`,
  
  // Wallet operations
  WALLET_VERIFY: '/wallet/verify',
  WALLET_BALANCE: (address: string) => `/wallet/balance/${address}`,
  
  // Token operations
  TOKENS: '/tokens',
  TOKEN_PRICE: (symbol: string) => `/tokens/price/${symbol}`,
};

// Request timeout (in milliseconds)
export const REQUEST_TIMEOUT = 30000;

// Default headers
export const getDefaultHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API versions
export const API_VERSION = 'v1'; 