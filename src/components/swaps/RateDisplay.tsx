
import { RefreshCw } from "lucide-react";
import { Token } from "@/contexts/portfolio";

interface RateDisplayProps {
  fromToken: Token | null;
  toToken: Token | null;
  exchangeRate: number;
  onRefresh: () => void;
}

const RateDisplay = ({ 
  fromToken, 
  toToken, 
  exchangeRate, 
  onRefresh 
}: RateDisplayProps) => {
  if (!fromToken || !toToken) return null;
  
  return (
    <div className="flex justify-between items-center text-sm text-muted-foreground mb-6 bg-muted/30 p-3 rounded-lg">
      <div>Exchange Rate</div>
      <div className="flex items-center">
        <span>1 {fromToken.symbol} = {exchangeRate.toFixed(4)} {toToken.symbol}</span>
        <button 
          className="ml-2 p-1 hover:bg-muted rounded-full" 
          onClick={onRefresh}
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default RateDisplay;
