
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWeb3 } from "@/contexts/Web3Context";
import { ExternalLink, Filter, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import NetworkGraph from "@/components/NetworkGraph";

// Mock transaction data
const MOCK_TRANSACTIONS = [
  {
    id: "tx1",
    type: "bridge",
    sourceChain: "Arbitrum",
    destinationChain: "Arweave",
    asset: "ETH",
    amount: "0.5",
    status: "completed",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    txHash: "0x1234...5678",
    fee: "0.001"
  },
  {
    id: "tx2",
    type: "bridge",
    sourceChain: "Base",
    destinationChain: "Arweave",
    asset: "USDC",
    amount: "100",
    status: "pending",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    txHash: "0xabcd...ef12",
    fee: "0.5"
  },
  {
    id: "tx3",
    type: "bridge",
    sourceChain: "Arbitrum",
    destinationChain: "Arweave",
    asset: "ETH",
    amount: "0.2",
    status: "completed",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    txHash: "0x7890...1234",
    fee: "0.0005"
  }
];

export default function Dashboard() {
  const { account, connectWallet, isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState("all");
  
  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  
  // Filter transactions by status
  const getFilteredTransactions = () => {
    if (activeTab === "all") return MOCK_TRANSACTIONS;
    return MOCK_TRANSACTIONS.filter(tx => 
      (activeTab === "pending" && tx.status === "pending") || 
      (activeTab === "completed" && tx.status === "completed")
    );
  };
  
  const filteredTransactions = getFilteredTransactions();

  return (
    <Layout withNetworkGraph={true}>
      <div className="container px-4 mx-auto py-8">
        <h1 className="text-2xl font-normal mb-6">Dashboard</h1>
        
        {/* Wallet Connection Status */}
        {!isConnected ? (
          <div className="border border-web3-border bg-web3-card/30 backdrop-blur-sm p-6 md:p-8 mb-8 text-center">
            <h2 className="text-xl font-normal mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Connect your wallet to view your transaction history and manage your assets.
            </p>
            <Button onClick={connectWallet} className="bg-web3-green text-black hover:bg-opacity-90 transition-opacity font-normal rounded-sm">
              Connect Wallet
            </Button>
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="border border-web3-border bg-web3-card/30 backdrop-blur-sm p-5">
                <div className="text-xs text-gray-400 mb-1">Connected Wallet</div>
                <div className="font-mono">{formatAddress(account || "")}</div>
              </div>
              
              <div className="border border-web3-border bg-web3-card/30 backdrop-blur-sm p-5">
                <div className="text-xs text-gray-400 mb-1">Total Bridged</div>
                <div className="font-mono">0.7 ETH + 100 USDC</div>
              </div>
              
              <div className="border border-web3-border bg-web3-card/30 backdrop-blur-sm p-5">
                <div className="text-xs text-gray-400 mb-1">Pending Transactions</div>
                <div className="font-mono">1</div>
              </div>
            </div>
            
            {/* Transactions */}
            <div className="border border-web3-border bg-web3-card/30 backdrop-blur-sm p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-normal">Transaction History</h2>
                <Button variant="outline" size="sm" className="border border-web3-border gap-2 rounded-sm bg-transparent">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
              
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="bg-web3-dark border border-web3-border">
                  <TabsTrigger value="all" className="rounded-none data-[state=active]:bg-web3-green data-[state=active]:text-black">All</TabsTrigger>
                  <TabsTrigger value="pending" className="rounded-none data-[state=active]:bg-web3-green data-[state=active]:text-black">Pending</TabsTrigger>
                  <TabsTrigger value="completed" className="rounded-none data-[state=active]:bg-web3-green data-[state=active]:text-black">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No transactions found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full font-mono text-sm">
                    <thead className="border-b border-web3-border">
                      <tr>
                        <th className="py-3 px-2 text-left text-xs font-normal text-gray-400">Asset</th>
                        <th className="py-3 px-2 text-left text-xs font-normal text-gray-400 hidden md:table-cell">From</th>
                        <th className="py-3 px-2 text-left text-xs font-normal text-gray-400 hidden md:table-cell">To</th>
                        <th className="py-3 px-2 text-left text-xs font-normal text-gray-400">Amount</th>
                        <th className="py-3 px-2 text-left text-xs font-normal text-gray-400">Status</th>
                        <th className="py-3 px-2 text-left text-xs font-normal text-gray-400 hidden md:table-cell">Time</th>
                        <th className="py-3 px-2 text-right text-xs font-normal text-gray-400">Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-web3-border">
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/5">
                          <td className="py-3 px-2">
                            <div className="flex items-center">
                              <div className="w-7 h-7 rounded-sm bg-web3-border flex items-center justify-center mr-2">
                                <span className="text-xs font-normal">{tx.asset[0]}</span>
                              </div>
                              <span>{tx.asset}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 hidden md:table-cell">
                            {tx.sourceChain}
                          </td>
                          <td className="py-3 px-2 hidden md:table-cell">
                            {tx.destinationChain}
                          </td>
                          <td className="py-3 px-2 mono-numbers">
                            {tx.amount} {tx.asset}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center">
                              {tx.status === "completed" ? (
                                <CheckCircle className="w-4 h-4 text-web3-green mr-1" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-500 mr-1" />
                              )}
                              <span className={cn(
                                tx.status === "completed" ? "text-web3-green" : "text-amber-500"
                              )}>
                                {tx.status === "completed" ? "Completed" : "Pending"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-gray-400 hidden md:table-cell mono-numbers">
                            {formatDate(tx.timestamp)}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-web3-green hover:text-white hover:bg-white/5"
                              onClick={() => window.open(`https://etherscan.io/tx/${tx.txHash}`, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Activity Log */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="border border-web3-border bg-web3-card/30 backdrop-blur-sm p-6">
                <h3 className="text-lg font-normal mb-4">Network Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Arbitrum</span>
                    <div className="flex items-center">
                      <span className="status-indicator status-active mr-2"></span>
                      <span className="text-sm">Operational</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Base</span>
                    <div className="flex items-center">
                      <span className="status-indicator status-active mr-2"></span>
                      <span className="text-sm">Operational</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Arweave</span>
                    <div className="flex items-center">
                      <span className="status-indicator status-active mr-2"></span>
                      <span className="text-sm">Operational</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border border-web3-border bg-web3-card/30 backdrop-blur-sm p-6">
                <h3 className="text-lg font-normal mb-4">System Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Average Confirmation Time</span>
                    <span className="text-sm mono-numbers">2m 34s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">24h Transaction Volume</span>
                    <span className="text-sm mono-numbers">$1,245,789</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Current Gas Price (Ethereum)</span>
                    <span className="text-sm mono-numbers">42 Gwei</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
