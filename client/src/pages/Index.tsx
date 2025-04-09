
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import { useWeb3 } from "@/contexts/Web3Context";
import NetworkGraph from "@/components/NetworkGraph";

export default function Index() {
  const { connectWallet, isConnected } = useWeb3();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-32 relative">
        <NetworkGraph className="absolute inset-0 z-0" nodeCount={15} lineCount={10} />
        <div className="container px-4 mx-auto">
          <div className={`max-w-4xl mx-auto text-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-4xl md:text-6xl font-normal mb-6">
              Hyper.<br />Parallel.<br />Bridging.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-3xl mx-auto">
              A decentralized cross-chain bridge built on top of Arweave's permanent data storage.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                className="bg-web3-green text-black hover:bg-opacity-90 transition-opacity font-normal text-lg px-8 py-6 rounded-sm"
              >
                <Link to="/bridge">
                  Start Bridging <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {!isConnected && (
                <Button
                  onClick={connectWallet}
                  variant="outline"
                  className="bg-transparent border border-web3-border hover:bg-white/5 transition-colors text-lg px-8 py-6 rounded-sm"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Section */}
      <section className="py-16 bg-web3-card/30 backdrop-blur-sm">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl mono-numbers font-light mb-2">$307,744,063</div>
              <div className="text-sm text-gray-400">TOTAL VALUE LOCKED</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mono-numbers font-light mb-2">328,541</div>
              <div className="text-sm text-gray-400">TRANSACTIONS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mono-numbers font-light mb-2">42,783</div>
              <div className="text-sm text-gray-400">ACTIVE USERS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mono-numbers font-light mb-2">3</div>
              <div className="text-sm text-gray-400">SUPPORTED CHAINS</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-normal mb-12 text-center">Protocol Design</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="border border-web3-border p-6 bg-web3-card/30 backdrop-blur-sm">
              <div className="text-web3-green font-mono mb-4">01</div>
              <h3 className="text-xl font-normal mb-3">Connect</h3>
              <p className="text-gray-400 text-sm">
                Securely connect your Web3 wallet to initiate the bridging process with zero-knowledge verification.
              </p>
            </div>
            
            <div className="border border-web3-border p-6 bg-web3-card/30 backdrop-blur-sm">
              <div className="text-web3-blue font-mono mb-4">02</div>
              <h3 className="text-xl font-normal mb-3">Select</h3>
              <p className="text-gray-400 text-sm">
                Choose your source chain (Arbitrum, Base) and destination (Arweave), then select the asset to bridge.
              </p>
            </div>
            
            <div className="border border-web3-border p-6 bg-web3-card/30 backdrop-blur-sm">
              <div className="text-web3-red font-mono mb-4">03</div>
              <h3 className="text-xl font-normal mb-3">Transfer</h3>
              <p className="text-gray-400 text-sm">
                Confirm the transaction and Ring will securely transfer your assets across chains with speed and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-normal mb-12 text-center">Key Features</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="border border-web3-border p-6 bg-web3-card/30 backdrop-blur-sm">
              <h3 className="text-lg font-normal mb-2">Secure Transfers</h3>
              <p className="text-gray-400 text-sm">
                Advanced cryptographic protocols ensure your assets are securely transferred between chains.
              </p>
            </div>
            <div className="border border-web3-border p-6 bg-web3-card/30 backdrop-blur-sm">
              <h3 className="text-lg font-normal mb-2">Fast & Efficient</h3>
              <p className="text-gray-400 text-sm">
                Experience lightning-fast bridging with minimal confirmation times and optimized gas fees.
              </p>
            </div>
            <div className="border border-web3-border p-6 bg-web3-card/30 backdrop-blur-sm">
              <h3 className="text-lg font-normal mb-2">Multi-Chain Support</h3>
              <p className="text-gray-400 text-sm">
                Bridge assets from popular L2 solutions like Arbitrum and Base to Arweave with ease.
              </p>
            </div>
            <div className="border border-web3-border p-6 bg-web3-card/30 backdrop-blur-sm">
              <h3 className="text-lg font-normal mb-2">Transparent Fees</h3>
              <p className="text-gray-400 text-sm">
                Clear fee structure with no hidden costs ensures you know exactly what you're paying for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative">
        <NetworkGraph className="absolute inset-0 z-0 opacity-30" nodeCount={10} lineCount={6} />
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center py-12 relative z-10">
            <h2 className="text-2xl font-normal mb-6">Ready to Bridge Your Assets?</h2>
            <p className="text-gray-400 mb-8">
              Join thousands of users who trust Ring for their cross-chain bridging needs.
            </p>
            <Button
              asChild
              className="bg-white text-black hover:bg-opacity-90 transition-colors font-normal text-lg px-8 py-6 rounded-sm"
            >
              <Link to="/bridge">
                Start Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Technical Info */}
      <section className="py-16 border-t border-web3-border">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-2">PHASE</div>
              <div className="text-base">Mainnet Early</div>
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-2">STATUS</div>
              <div className="flex items-center">
                <span className="status-indicator status-active mr-2"></span>
                <span>Live</span>
              </div>
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-2">LAUNCH</div>
              <div className="text-base mono-numbers">2025-04-07</div>
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-2">GITHUB</div>
              <a href="#" className="flex items-center text-web3-green hover:underline">
                <span className="mr-1">View source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
