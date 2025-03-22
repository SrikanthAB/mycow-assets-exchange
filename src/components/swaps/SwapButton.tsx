
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkle } from "lucide-react";
import { Token } from "@/contexts/portfolio";

interface SwapButtonProps {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: number;
  isSwapping: boolean;
  onClick: () => void;
}

const SwapButton = ({ 
  fromToken, 
  toToken, 
  fromAmount, 
  isSwapping, 
  onClick 
}: SwapButtonProps) => {
  const insufficientBalance = fromToken && fromAmount > fromToken.balance;

  return (
    <Button 
      className="w-full shadow-md bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-300" 
      disabled={!fromToken || !toToken || fromAmount <= 0 || insufficientBalance || isSwapping}
      onClick={onClick}
    >
      {isSwapping ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Swapping...
        </>
      ) : insufficientBalance ? (
        "Insufficient Balance"
      ) : (
        <>
          <Sparkle className="h-4 w-4 mr-1" />
          Swap Tokens
        </>
      )}
    </Button>
  );
};

export default SwapButton;
