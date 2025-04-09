
import { cn } from "@/lib/utils";

export interface Chain {
  id: number;
  name: string;
  icon: string;
  testnet: boolean;
}

export interface ChainCardProps {
  chain: Chain;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ChainCard({ chain, selected, onClick, disabled, className }: ChainCardProps) {
  return (
    <div
      className={cn(
        "border border-web3-border rounded-sm p-3 cursor-pointer transition-all duration-200 hover:bg-white/5",
        "backdrop-blur-sm bg-web3-dark/50",
        selected && "border-web3-green bg-web3-green/10",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-sm bg-web3-border flex items-center justify-center">
          <img src={chain.icon} alt={chain.name} className="w-6 h-6" />
        </div>
        <div>
          <div className="font-normal text-sm">{chain.name}</div>
          {chain.testnet && (
            <div className="text-xs text-gray-400">Testnet</div>
          )}
        </div>
      </div>
    </div>
  );
}
