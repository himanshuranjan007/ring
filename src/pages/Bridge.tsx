
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Info, AlertCircle } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { Chain, ChainCard } from "@/components/ChainCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import NetworkGraph from "@/components/NetworkGraph";

const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 42161,
    name: "Arbitrum",
    icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
    testnet: false,
  },
  {
    id: 8453,
    name: "Base",
    icon: "https://cryptologos.cc/logos/base-logo.png",
    testnet: false,
  },
  {
    id: 421613,
    name: "Arbitrum Goerli",
    icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
    testnet: true,
  },
  {
    id: 84531,
    name: "Base Goerli",
    icon: "https://cryptologos.cc/logos/base-logo.png",
    testnet: true,
  }
];

const DESTINATION_CHAIN: Chain = {
  id: 1,
  name: "Arweave",
  icon: "https://cryptologos.cc/logos/arweave-ar-logo.png",
  testnet: false,
};

const AVAILABLE_TOKENS = [
  { symbol: "ETH", name: "Ethereum", balance: "0.00", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { symbol: "USDC", name: "USD Coin", balance: "0.00", icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png" },
  { symbol: "USDT", name: "Tether", balance: "0.00", icon: "https://cryptologos.cc/logos/tether-usdt-logo.png" },
];

export default function Bridge() {
  const { account, connectWallet, isConnected } = useWeb3();
  const [sourceChain, setSourceChain] = useState<Chain | null>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [showTokens, setShowTokens] = useState<boolean>(false);
  
  const handleBridge = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
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

    toast.success(`Initiated bridge of ${amount} ${selectedToken} from ${sourceChain.name} to Arweave`, {
      description: "Transaction submitted. Check your dashboard for progress.",
    });
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
              
              {/* Token Selection */}
              <div className="mb-6">
                <label className="text-sm font-normal text-gray-300 mb-2 block">Select Token</label>
                
                <div className="relative">
                  <button
                    onClick={() => setShowTokens(!showTokens)}
                    className="w-full flex items-center justify-between p-3 rounded-sm bg-web3-dark border border-web3-border text-left"
                  >
                    {selectedToken ? (
                      <div className="flex items-center">
                        <img 
                          src={AVAILABLE_TOKENS.find(t => t.symbol === selectedToken)?.icon} 
                          alt={selectedToken} 
                          className="w-6 h-6 mr-2" 
                        />
                        <span>{selectedToken}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Select a token</span>
                    )}
                    <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
                  </button>
                  
                  {/* Token Dropdown */}
                  {showTokens && (
                    <div className="absolute z-10 mt-1 w-full bg-web3-card border border-web3-border">
                      {AVAILABLE_TOKENS.map((token) => (
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
                          <span className="text-gray-400 mono-numbers">Balance: {token.balance}</span>
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
                      onClick={() => setAmount("0.1")}
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
                        src={AVAILABLE_TOKENS.find(t => t.symbol === selectedToken)?.icon} 
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
                disabled={!sourceChain || !selectedToken || !amount || parseFloat(amount) <= 0}
                className={cn(
                  "w-full py-6 text-lg font-normal rounded-sm",
                  sourceChain && selectedToken && amount && parseFloat(amount) > 0
                    ? "bg-web3-green text-black hover:bg-opacity-90 transition-opacity"
                    : "bg-web3-border text-gray-400 cursor-not-allowed"
                )}
              >
                Bridge Assets
              </Button>
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
