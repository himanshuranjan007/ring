import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { walletService } from "../services/api";
import { ApiError } from "../services/api/apiClient";

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  connecting: boolean;
  authToken: string | null;
  isAuthenticating: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  authenticateWallet: () => Promise<boolean>;
  isConnected: boolean;
  isAuthenticated: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "auth_token";

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedAccount = localStorage.getItem("walletAddress");
    const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (savedAccount) {
      setAccount(savedAccount);
    }
    
    if (savedToken) {
      setAuthToken(savedToken);
    }
  }, []);

  // Check if window.ethereum exists
  const isMetaMaskAvailable = () => {
    return typeof window !== "undefined" && window.ethereum !== undefined;
  };

  // Connect to wallet
  const connectWallet = async () => {
    if (!isMetaMaskAvailable()) {
      toast.error("MetaMask is not installed. Please install MetaMask to use this application.");
      return;
    }

    setConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      
      // Convert chainId from hex to decimal
      const chainIdDecimal = parseInt(chainIdHex, 16);
      
      setAccount(accounts[0]);
      setChainId(chainIdDecimal);
      localStorage.setItem("walletAddress", accounts[0]);
      
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    } finally {
      setConnecting(false);
    }
  };

  // Authenticate wallet with backend
  const authenticateWallet = async (): Promise<boolean> => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return false;
    }
    
    setIsAuthenticating(true);
    
    try {
      // Create signature message
      const message = `Sign this message to authenticate with Ring Weave Bridge: ${Date.now()}`;
      
      // Request signature from user
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, account]
      });
      
      // Verify with backend
      const response = await walletService.verifyWallet({
        address: account,
        signature,
        message
      });
      
      // Save token
      setAuthToken(response.token);
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      
      toast.success("Wallet authenticated successfully!");
      return true;
    } catch (error) {
      console.error("Error authenticating wallet:", error);
      
      if (error instanceof ApiError) {
        toast.error(`Authentication failed: ${error.message}`);
      } else {
        toast.error("Failed to authenticate wallet. Please try again.");
      }
      
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setAuthToken(null);
    localStorage.removeItem("walletAddress");
    localStorage.removeItem(AUTH_TOKEN_KEY);
    toast.success("Wallet disconnected");
  };

  // Handle account changes
  useEffect(() => {
    if (!isMetaMaskAvailable()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet();
      } else if (accounts[0] !== account) {
        // User switched accounts
        setAccount(accounts[0]);
        localStorage.setItem("walletAddress", accounts[0]);
        // Clear auth token as it's tied to the account
        setAuthToken(null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        toast.info("Account changed. Please re-authenticate.");
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const chainIdDecimal = parseInt(chainIdHex, 16);
      setChainId(chainIdDecimal);
      toast.info("Network changed");
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // If user has connected before, get their current account and chain
    if (account) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            // No accounts found, user must have disconnected
            disconnectWallet();
          }
        })
        .catch(console.error);

      window.ethereum
        .request({ method: "eth_chainId" })
        .then((chainIdHex: string) => {
          setChainId(parseInt(chainIdHex, 16));
        })
        .catch(console.error);
    }

    return () => {
      if (isMetaMaskAvailable()) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [account]);

  const value = {
    account,
    chainId,
    connecting,
    authToken,
    isAuthenticating,
    connectWallet,
    disconnectWallet,
    authenticateWallet,
    isConnected: !!account,
    isAuthenticated: !!authToken,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}

// Add window.ethereum type
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, listener: any) => void;
      removeListener: (event: string, listener: any) => void;
    };
  }
}
