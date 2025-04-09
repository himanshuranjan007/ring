
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";
import NetworkGraph from "./NetworkGraph";

type LayoutProps = {
  children: ReactNode;
  className?: string;
  withNetworkGraph?: boolean;
};

export default function Layout({ children, className, withNetworkGraph = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-web3-dark relative overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid z-0" />
      
      {/* Network graph background */}
      {withNetworkGraph && (
        <NetworkGraph className="fixed inset-0 z-0 opacity-30" />
      )}
      
      {/* Content */}
      <Navbar />
      <main className={cn("pt-16 relative z-10", className)}>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-web3-border mt-20 py-6 relative z-10">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-xl font-normal">Ring.</span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <span className="status-indicator status-active mr-2"></span>
                Live
              </span>
              <span>|</span>
              <span>MAINNET</span>
            </div>
            <div className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Ring Protocol.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
