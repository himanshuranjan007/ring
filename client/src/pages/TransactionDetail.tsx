import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useWeb3 } from "@/contexts/Web3Context";
import { bridgeService } from "@/services/api";
import { ApiError } from "@/services/api/apiClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function TransactionDetail() {
  const { txId } = useParams<{ txId: string }>();
  const navigate = useNavigate();
  const { isConnected, isAuthenticated, authToken, authenticateWallet } = useWeb3();
  const [transaction, setTransaction] = useState<bridgeService.BridgeStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch transaction details when component mounts
  useEffect(() => {
    if (isConnected && isAuthenticated && authToken && txId) {
      fetchTransactionDetails();
    }
  }, [isConnected, isAuthenticated, authToken, txId]);

  const fetchTransactionDetails = async () => {
    if (!txId || !authToken) {
      return;
    }

    setIsLoading(true);
    try {
      const txDetails = await bridgeService.getBridgeStatus(txId, authToken);
      setTransaction(txDetails);
    } catch (error) {
      console.error("Failed to fetch transaction details:", error);
      if (error instanceof ApiError) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Failed to load transaction details. Please try again.");
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

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleAuthenticate = async () => {
    await authenticateWallet();
  };

  const getExplorerUrl = (chainId: number, txId: string) => {
    // Mock function - in a real app, you would determine the explorer URL based on the chain ID
    return `https://etherscan.io/tx/${txId}`;
  };

  if (!txId) {
    return (
      <Layout>
        <div className="container px-4 py-8 mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-normal mb-6">Transaction Not Found</h1>
          <Button onClick={() => navigate("/transactions")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Transactions
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/transactions")}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-normal">Transaction Details</h1>
          <Button
            onClick={fetchTransactionDetails}
            variant="outline"
            size="sm"
            disabled={isLoading || !isAuthenticated}
            className="text-xs gap-1 ml-auto"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {!isConnected ? (
          <div className="p-8 border border-web3-border rounded-md text-center">
            <h2 className="text-xl mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Please connect your wallet to view transaction details.
            </p>
          </div>
        ) : !isAuthenticated ? (
          <div className="p-8 border border-web3-border rounded-md text-center">
            <h2 className="text-xl mb-4">Authenticate Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Please authenticate your wallet to view transaction details.
            </p>
            <Button onClick={handleAuthenticate} className="bg-web3-green text-black">
              Authenticate Wallet
            </Button>
          </div>
        ) : isLoading ? (
          <div className="p-8 border border-web3-border rounded-md text-center">
            <RefreshCw className="w-8 h-8 mb-4 mx-auto animate-spin text-web3-green" />
            <p>Loading transaction details...</p>
          </div>
        ) : !transaction ? (
          <div className="p-8 border border-web3-border rounded-md text-center">
            <h2 className="text-xl mb-4">Transaction Not Found</h2>
            <p className="text-gray-400 mb-6">
              The requested transaction could not be found.
            </p>
            <Button onClick={() => navigate("/transactions")} className="bg-web3-green text-black">
              View All Transactions
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Transaction Overview Card */}
            <div className="p-6 border border-web3-border rounded-md bg-web3-card/30 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-normal">Bridge Transaction</h2>
                  <p className="text-sm text-gray-400 mt-1">#{transaction.txId}</p>
                </div>
                {getStatusBadge(transaction.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-sm text-gray-400 mb-2">Transaction Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Amount:</span>
                      <span className="font-mono">
                        {transaction.amount} {transaction.tokenSymbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">From Chain:</span>
                      <span>Chain ID: {transaction.sourceChainId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">To Chain:</span>
                      <span>Chain ID: {transaction.destinationChainId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Wallet:</span>
                      <span className="font-mono text-xs truncate max-w-[200px]">
                        {transaction.walletAddress}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-2">Time Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Created:</span>
                      <span>{format(new Date(transaction.timestamp), "MMM d, yyyy HH:mm")}</span>
                    </div>
                    {transaction.status === "completed" && transaction.completionTime && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Completed:</span>
                        <span>
                          {format(new Date(transaction.completionTime), "MMM d, yyyy HH:mm")}
                        </span>
                      </div>
                    )}
                    {transaction.status === "pending" && transaction.estimatedCompletionTime && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Estimated Completion:</span>
                        <span>
                          {formatDistanceToNow(new Date(transaction.estimatedCompletionTime), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <a
                      href={getExplorerUrl(transaction.sourceChainId, transaction.txId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-web3-green text-sm flex items-center hover:underline"
                    >
                      View on Explorer
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="p-6 border border-web3-border rounded-md">
              <h2 className="text-lg font-normal mb-6">Transaction Progress</h2>

              <div className="space-y-8">
                {transaction.steps.map((step, index) => (
                  <div key={index} className="relative pl-8">
                    {/* Connector Line */}
                    {index < transaction.steps.length - 1 && (
                      <div className="absolute left-[10px] top-[24px] bottom-[-16px] w-0.5 bg-web3-border" />
                    )}

                    {/* Step Content */}
                    <div className="flex items-start">
                      <div className="absolute left-0 top-0">
                        {getStepStatusIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{step.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {step.timestamp
                            ? format(new Date(step.timestamp), "MMM d, yyyy HH:mm:ss")
                            : step.status === "in_progress"
                            ? "In progress..."
                            : "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 