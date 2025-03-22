
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
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
      className="w-full" 
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
        "Swap Tokens"
      )}
    </Button>
  );
};

export default SwapButton;
