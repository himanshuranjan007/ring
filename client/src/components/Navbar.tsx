
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { account, connectWallet, disconnectWallet, connecting } = useWeb3();

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-web3-purple to-web3-teal p-0.5 mr-2">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
              </div>
              <span className="text-xl font-bold text-white">Ring</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-200 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/bridge" className="text-gray-200 hover:text-white transition-colors">
              Bridge
            </Link>
            <Link to="/dashboard" className="text-gray-200 hover:text-white transition-colors">
              Dashboard
            </Link>
            <div className="ml-4">
              {!account ? (
                <Button
                  onClick={connectWallet}
                  disabled={connecting}
                  className="bg-gradient-to-r from-web3-purple to-web3-teal hover:opacity-90 transition-opacity font-medium"
                >
                  {connecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="px-4 py-2 bg-web3-card rounded-md border border-white/10">
                    <span className="text-white">{formatAddress(account)}</span>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={disconnectWallet}
                    className="bg-web3-dark hover:bg-web3-card border border-white/10 transition-colors"
                  >
                    Disconnect
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden bg-web3-dark border-t border-white/10",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-web3-card"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/bridge"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-web3-card"
            onClick={() => setMobileMenuOpen(false)}
          >
            Bridge
          </Link>
          <Link
            to="/dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-web3-card"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <div className="px-3 py-3">
            {!account ? (
              <Button
                onClick={() => {
                  connectWallet();
                  setMobileMenuOpen(false);
                }}
                disabled={connecting}
                className="w-full bg-gradient-to-r from-web3-purple to-web3-teal hover:opacity-90 transition-opacity font-medium"
              >
                {connecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="px-4 py-2 bg-web3-card rounded-md border border-white/10 text-center">
                  <span className="text-white">{formatAddress(account)}</span>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    disconnectWallet();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-web3-dark hover:bg-web3-card border border-white/10 transition-colors"
                >
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
