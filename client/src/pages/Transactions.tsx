import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useWeb3 } from "@/contexts/Web3Context";
import { bridgeService } from "@/services/api";
import { ApiError } from "@/services/api/apiClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, RefreshCw, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function Transactions() {
  const { account, isConnected, isAuthenticated, authToken, authenticateWallet } = useWeb3();
  const [transactions, setTransactions] = useState<bridgeService.BridgeTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch transactions when component mounts
  useEffect(() => {
    if (isConnected && isAuthenticated && account && authToken) {
      fetchTransactions();
    }
  }, [isConnected, isAuthenticated, account, authToken]);

  const fetchTransactions = async () => {
    if (!account || !authToken) {
      return;
    }

    setIsLoading(true);
    try {
      const transactionData = await bridgeService.getBridgeTransactions(account, authToken);
      setTransactions(transactionData);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      if (error instanceof ApiError) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Failed to load transactions. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const handleAuthenticate = async () => {
    await authenticateWallet();
  };

  const viewDetails = (txId: string) => {
    navigate(`/transaction/${txId}`);
  };

  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-normal">Transaction History</h1>
          <Button
            onClick={fetchTransactions}
            variant="outline"
            size="sm"
            disabled={isLoading || !isAuthenticated}
            className="text-xs gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {!isConnected ? (
          <div className="p-8 border border-web3-border rounded-md text-center">
            <h2 className="text-xl mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Please connect your wallet to view your transaction history.
            </p>
          </div>
        ) : !isAuthenticated ? (
          <div className="p-8 border border-web3-border rounded-md text-center">
            <h2 className="text-xl mb-4">Authenticate Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Please authenticate your wallet to view your transaction history.
            </p>
            <Button onClick={handleAuthenticate} className="bg-web3-green text-black">
              Authenticate Wallet
            </Button>
          </div>
        ) : isLoading ? (
          <div className="p-8 border border-web3-border rounded-md text-center">
            <RefreshCw className="w-8 h-8 mb-4 mx-auto animate-spin text-web3-green" />
            <p>Loading your transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 border border-web3-border rounded-md text-center">
            <h2 className="text-xl mb-4">No Transactions Found</h2>
            <p className="text-gray-400 mb-6">
              You haven't made any bridge transactions yet.
            </p>
            <Button onClick={() => navigate("/bridge")} className="bg-web3-green text-black">
              Bridge Assets
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.txId}
                className="p-4 border border-web3-border rounded-md hover:bg-web3-border/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-md font-medium flex items-center">
                      Bridge Transaction
                      <span className="text-xs text-gray-400 ml-2">#{tx.txId.substring(0, 8)}</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  {getStatusBadge(tx.status)}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-mono">
                        {tx.amount} {tx.tokenSymbol}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span>Chain ID: {tx.sourceChainId}</span>
                        <ArrowRight className="w-3 h-3" />
                        <span>Chain ID: {tx.destinationChainId}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1 text-web3-green"
                    onClick={() => viewDetails(tx.txId)}
                  >
                    View Details
                    <ArrowUpRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
} 