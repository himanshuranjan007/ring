import { apiGet, apiPost } from './apiClient';
import { ENDPOINTS } from './config';

// Types
export interface WalletVerificationRequest {
  address: string;
  signature: string;
  message: string;
}

export interface WalletVerificationResponse {
  token: string;
  address: string;
}

export interface TokenBalance {
  symbol: string;
  balance: string;
  value_usd: string;
}

export interface WalletBalance {
  address: string;
  chainId: number;
  balances: TokenBalance[];
}

/**
 * Verify wallet signature to authenticate user
 * @param verificationData Wallet verification data
 * @returns Promise with JWT token
 */
export const verifyWallet = async (
  verificationData: WalletVerificationRequest
): Promise<WalletVerificationResponse> => {
  return apiPost<WalletVerificationResponse>(
    ENDPOINTS.WALLET_VERIFY,
    verificationData
  );
};

/**
 * Get wallet balance for specified chain and tokens
 * @param address Wallet address
 * @param chainId Chain ID
 * @param token JWT auth token
 * @returns Promise with wallet balance data
 */
export const getWalletBalance = async (
  address: string,
  chainId: number,
  token: string
): Promise<WalletBalance> => {
  return apiGet<WalletBalance>(
    `${ENDPOINTS.WALLET_BALANCE(address)}?chainId=${chainId}`,
    token
  );
}; 