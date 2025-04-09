import { apiGet } from './apiClient';
import { ENDPOINTS } from './config';

// Types
export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  icon: string;
  price_usd: string;
}

export interface SupportedTokensResponse {
  chainId: number;
  tokens: Token[];
}

export interface TokenPrice {
  symbol: string;
  price: {
    usd: string;
    change_24h: string;
  };
}

/**
 * Get supported tokens for a specific chain
 * @param chainId Chain ID
 * @returns Promise with supported tokens data
 */
export const getSupportedTokens = async (
  chainId: number
): Promise<SupportedTokensResponse> => {
  return apiGet<SupportedTokensResponse>(`${ENDPOINTS.TOKENS}?chainId=${chainId}`);
};

/**
 * Get current price for a token
 * @param symbol Token symbol
 * @returns Promise with token price data
 */
export const getTokenPrice = async (symbol: string): Promise<TokenPrice> => {
  return apiGet<TokenPrice>(ENDPOINTS.TOKEN_PRICE(symbol));
}; 