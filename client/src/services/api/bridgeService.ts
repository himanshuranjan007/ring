import { apiGet, apiPost } from './apiClient';
import { ENDPOINTS } from './config';

// Types
export interface BridgeTransaction {
  txId: string;
  sourceChainId: number;
  destinationChainId: number;
  tokenSymbol: string;
  amount: string;
  walletAddress: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  estimatedCompletionTime?: string;
  completionTime?: string;
}

export interface BridgeStatus extends BridgeTransaction {
  steps: Array<{
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    timestamp: string | null;
  }>;
}

export interface BridgeRequest {
  sourceChainId: number;
  destinationChainId: number;
  tokenSymbol: string;
  amount: string;
  walletAddress: string;
  destinationAddress?: string;
}

/**
 * Initiate a bridge transaction
 * @param bridgeData Bridge request data
 * @param token JWT auth token
 * @returns Promise with transaction data
 */
export const initiateBridge = async (
  bridgeData: BridgeRequest,
  token: string
): Promise<BridgeTransaction> => {
  return apiPost<BridgeTransaction>(ENDPOINTS.BRIDGE, bridgeData, token);
};

/**
 * Get all bridge transactions for the authenticated user
 * @param walletAddress User's wallet address
 * @param token JWT auth token
 * @returns Promise with array of transactions
 */
export const getBridgeTransactions = async (
  walletAddress: string,
  token: string
): Promise<BridgeTransaction[]> => {
  return apiGet<BridgeTransaction[]>(`${ENDPOINTS.BRIDGE}?address=${walletAddress}`, token);
};

/**
 * Get status of a specific bridge transaction
 * @param txId Transaction ID
 * @param token JWT auth token
 * @returns Promise with detailed transaction status
 */
export const getBridgeStatus = async (
  txId: string,
  token: string
): Promise<BridgeStatus> => {
  return apiGet<BridgeStatus>(ENDPOINTS.BRIDGE_STATUS(txId), token);
}; 