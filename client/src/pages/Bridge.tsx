import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Info, AlertCircle, Loader2, Check } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { Chain, ChainCard } from "@/components/ChainCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { bridgeService, tokenService, walletService } from "@/services/api";
import { ApiError } from "@/services/api/apiClient";
import { useNavigate } from "react-router-dom";

const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 42161,
    name: "Arbitrum",
    icon: "https://res.coinpaper.com/coinpaper/arb_fba92b25bc.png",
    testnet: false,
  },
  {
    id: 8453,
    name: "Base",
    icon: "https://brandfetch.com/base.org?view=library&library=default&collection=logos&asset=idECUXGIk-&utm_source=https%253A%252F%252Fbrandfetch.com%252Fbase.org&utm_medium=copyAction&utm_campaign=brandPageReferral",
    testnet: false,
  },
  {
    id: 421613,
    name: "Arbitrum Goerli",
    icon: "https://res.coinpaper.com/coinpaper/arb_fba92b25bc.png",
    testnet: true,
  },
  {
    id: 84531,
    name: "Base Goerli",
    icon: "https://brandfetch.com/base.org?view=library&library=default&collection=logos&asset=idECUXGIk-&utm_source=https%253A%252F%252Fbrandfetch.com%252Fbase.org&utm_medium=copyAction&utm_campaign=brandPageReferral",

    testnet: true,
  }
];

const DESTINATION_CHAIN: Chain = {
  id: 1,
  name: "Arweave",
  icon: "./arweave.png",
  testnet: false,
};

export default function Bridge() {
  const { account, connectWallet, isConnected, authenticateWallet, isAuthenticated, authToken } = useWeb3();
  const [sourceChain, setSourceChain] = useState<Chain | null>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [isValidArweaveAddress, setIsValidArweaveAddress] = useState<boolean>(false);
  const [showTokens, setShowTokens] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBridging, setIsBridging] = useState<boolean>(false);
  const [availableTokens, setAvailableTokens] = useState<tokenService.Token[]>([]);
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({});
  const [isFetchingBalances, setIsFetchingBalances] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Fetch available tokens when source chain changes
  useEffect(() => {
    if (!sourceChain) return;
    
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        const result = await tokenService.getSupportedTokens(sourceChain.id);
        setAvailableTokens(result.tokens);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        toast.error('Failed to load available tokens');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTokens();
  }, [sourceChain]);
  
  // Fetch wallet balances when account and chain are available
  useEffect(() => {
    if (!account || !sourceChain || !isAuthenticated || !authToken) return;
    
    const fetchBalances = async () => {
      setIsFetchingBalances(true);
      try {
        const result = await walletService.getWalletBalance(account, sourceChain.id, authToken);
        
        // Convert balance array to record for easier lookup
        const balances: Record<string, string> = {};
        result.balances.forEach(balance => {
          balances[balance.symbol] = balance.balance;
        });
        
        setTokenBalances(balances);
      } catch (error) {
        console.error('Error fetching balances:', error);
        toast.error(`Failed to fetch balances for ${sourceChain.name}`);
      } finally {
        setIsFetchingBalances(false);
      }
    };
    
    fetchBalances();
  }, [account, sourceChain, isAuthenticated, authToken]);
  
  // Validate Arweave address
  useEffect(() => {
    // Simple validation - Arweave addresses are typically 43 characters long and start with a specific format
    const isValid = /^[a-zA-Z0-9_-]{43}$/.test(destinationAddress);
    setIsValidArweaveAddress(isValid);
  }, [destinationAddress]);

  const handleAuthenticate = async () => {
    if (!isConnected) {
      await connectWallet();
    }
    
    if (!isAuthenticated) {
      await authenticateWallet();
    }
  };
  
  const handleBridge = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!isAuthenticated) {
      const success = await authenticateWallet();
      if (!success) return;
    }
    
    if (!sourceChain) {
      toast.error("Please select a source chain");
      return;
    }
    
    if (!selectedToken) {
      toast.error("Please select a token");
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!destinationAddress || !isValidArweaveAddress) {
      toast.error("Please enter a valid Arweave destination address");
      return;
    }
    
    if (!account || !authToken) {
      toast.error("Authentication issue. Please reconnect your wallet.");
      return;
    }
    
    setIsBridging(true);
    
    try {
      const bridgeResult = await bridgeService.initiateBridge({
        sourceChainId: sourceChain.id,
        destinationChainId: DESTINATION_CHAIN.id,
        tokenSymbol: selectedToken,
        amount,
        walletAddress: account,
        destinationAddress: destinationAddress
      }, authToken);
      
      toast.success(`Initiated bridge of ${amount} ${selectedToken} from ${sourceChain.name} to Arweave`, {
        description: "Transaction submitted. Redirecting to transaction details...",
      });
      
      // Navigate to transaction details page
      setTimeout(() => {
        navigate(`/transaction/${bridgeResult.txId}`);
      }, 1500);
      
      // Reset form
      setAmount("");
      setSelectedToken(null);
    } catch (error) {
      console.error('Bridge error:', error);
      
      if (error instanceof ApiError) {
        toast.error(`Bridge failed: ${error.message}`);
      } else {
        toast.error("Failed to initiate bridge. Please try again.");
      }
    } finally {
      setIsBridging(false);
    }
  };

  return (
    <Layout withNetworkGraph={true}>
      <div className="container px-4 mx-auto py-8 max-w-3xl mt-8">
        <h1 className="text-2xl font-normal mb-6">Bridge Assets</h1>
        
        <div className="border border-web3-border bg-web3-card/30 backdrop-blur-sm p-6 md:p-8 mb-8">
          {/* Connect Wallet Prompt */}
          {!isConnected ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-normal mb-4">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-6">
                To start bridging your assets, please connect your wallet first.
              </p>
              <Button onClick={connectWallet} className="bg-web3-green text-black hover:bg-opacity-90 transition-opacity font-normal rounded-sm">
                Connect Wallet
              </Button>
            </div>
          ) : !isAuthenticated ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-normal mb-4">Authenticate Your Wallet</h2>
              <p className="text-gray-400 mb-6">
                Please authenticate your wallet to access the bridge.
              </p>
              <Button onClick={authenticateWallet} className="bg-web3-green text-black hover:bg-opacity-90 transition-opacity font-normal rounded-sm">
                Authenticate Wallet
              </Button>
            </div>
          ) : (
            <>
              {/* Source Chain Selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-normal text-gray-300">Source Chain</label>
                  <div className="text-xs text-gray-400 flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Select the chain where your assets are currently located
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SUPPORTED_CHAINS.map((chain) => (
                    <ChainCard
                      key={chain.id}
                      chain={chain}
                      selected={sourceChain?.id === chain.id}
                      onClick={() => setSourceChain(chain)}
                    />
                  ))}
                </div>
              </div>
              
              {/* Direction Arrow */}
              <div className="flex justify-center my-6">
                <div className="hidden sm:flex items-center w-full max-w-xs">
                  <div className="h-px bg-web3-border flex-grow"></div>
                  <div className="mx-4">
                    <ArrowRight className="text-web3-green w-6 h-6" />
                  </div>
                  <div className="h-px bg-web3-border flex-grow"></div>
                </div>
                <div className="sm:hidden">
                  <ArrowRight className="text-web3-green w-6 h-6" />
                </div>
              </div>
              
              {/* Destination Chain */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-normal text-gray-300">Destination Chain</label>
                  <div className="text-xs text-gray-400 flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Assets will be bridged to Arweave
                  </div>
                </div>
                <div className="max-w-[160px]">
                  <ChainCard chain={DESTINATION_CHAIN} selected={true} disabled={true} />
                </div>
              </div>

              {/* Destination Address Input */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-normal text-gray-300">Destination Arweave Address</label>
                </div>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter Arweave wallet address"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    className={cn(
                      "bg-web3-dark border-web3-border focus:border-web3-green p-3 rounded-sm font-mono",
                      isValidArweaveAddress && destinationAddress ? "border-web3-green" : "",
                      destinationAddress && !isValidArweaveAddress ? "border-red-500" : ""
                    )}
                  />
                  {destinationAddress && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isValidArweaveAddress ? (
                        <Check className="w-5 h-5 text-web3-green" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {destinationAddress && !isValidArweaveAddress && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid Arweave address</p>
                )}
              </div>
              
              {/* Token Selection */}
              <div className="mb-6">
                <label className="text-sm font-normal text-gray-300 mb-2 block">Select Token</label>
                
                <div className="relative">
                  <button
                    onClick={() => setShowTokens(!showTokens)}
                    disabled={isLoading || !sourceChain}
                    className="w-full flex items-center justify-between p-3 rounded-sm bg-web3-dark border border-web3-border text-left disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        <span className="text-gray-400">Loading tokens...</span>
                      </div>
                    ) : selectedToken ? (
                      <div className="flex items-center">
                        <img 
                          src={availableTokens.find(t => t.symbol === selectedToken)?.icon} 
                          alt={selectedToken} 
                          className="w-6 h-6 mr-2" 
                        />
                        <span>{selectedToken}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">{sourceChain ? 'Select a token' : 'Please select a chain first'}</span>
                    )}
                    <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
                  </button>
                  
                  {/* Token Dropdown */}
                  {showTokens && !isLoading && availableTokens.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-web3-card border border-web3-border">
                      {availableTokens.map((token) => (
                        <div
                          key={token.symbol}
                          className="flex items-center justify-between p-3 hover:bg-web3-border/30 cursor-pointer"
                          onClick={() => {
                            setSelectedToken(token.symbol);
                            setShowTokens(false);
                          }}
                        >
                          <div className="flex items-center">
                            <img src={token.icon} alt={token.name} className="w-6 h-6 mr-2" />
                            <span>{token.symbol}</span>
                          </div>
                          <div className="text-gray-400 mono-numbers flex items-center">
                            {isFetchingBalances ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <>Balance: {tokenBalances[token.symbol] || '0.00'}</>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Amount Input */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-normal text-gray-300">Amount</label>
                  {selectedToken && (
                    <button 
                      className="text-xs text-web3-green hover:underline"
                      onClick={() => setAmount(tokenBalances[selectedToken] || '0.1')}
                    >
                      Max
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-web3-dark border-web3-border focus:border-web3-green text-lg p-6 rounded-sm font-mono"
                    disabled={!selectedToken}
                  />
                  {selectedToken && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                      <img 
                        src={availableTokens.find(t => t.symbol === selectedToken)?.icon} 
                        alt={selectedToken} 
                        className="w-5 h-5 mr-2" 
                      />
                      <span>{selectedToken}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bridge Fee Info */}
              <div className="p-3 border border-web3-border mb-6 flex items-start bg-web3-dark/50">
                <AlertCircle className="text-web3-green w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-normal">Bridge Fee</p>
                  <p className="text-gray-400 text-xs">A small fee is required to cover the cost of bridging assets across chains. This fee varies depending on network conditions.</p>
                </div>
              </div>
              
              {/* Bridge Button */}
              <Button
                onClick={handleBridge}
                disabled={
                  !sourceChain || 
                  !selectedToken || 
                  !amount || 
                  parseFloat(amount) <= 0 || 
                  !destinationAddress ||
                  !isValidArweaveAddress ||
                  isBridging
                }
                className={cn(
                  "w-full py-6 text-lg font-normal rounded-sm",
                  sourceChain && selectedToken && amount && parseFloat(amount) > 0 && destinationAddress && isValidArweaveAddress && !isBridging
                    ? "bg-web3-green text-black hover:bg-opacity-90 transition-opacity"
                    : "bg-web3-border text-gray-400 cursor-not-allowed"
                )}
              >
                {isBridging ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Bridge Assets"
                )}
              </Button>
              
              {/* View Transactions Link */}
              <div className="text-center mt-4">
                <Button 
                  variant="link" 
                  onClick={() => navigate('/transactions')} 
                  className="text-web3-green hover:text-white text-sm"
                >
                  View Your Transactions
                </Button>
              </div>
            </>
          )}
        </div>
        
        {/* Information Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
          <div className="flex flex-col space-y-1">
            <span className="text-white">Protocol:</span>
            <span>Ring Bridge v1.0</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-white">Status:</span>
            <div className="flex items-center">
              <span className="status-indicator status-active mr-2"></span>
              <span>Operational</span>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-white">Gas:</span>
            <span className="mono-numbers">42 gwei</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
