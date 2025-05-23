
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkle } from "lucide-react";
import { Token } from "@/contexts/portfolio";
import { useTheme } from "@/components/ui/theme-provider";

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
  const { theme } = useTheme();
  const insufficientBalance = fromToken && fromAmount > fromToken.balance;

  return (
    <Button 
      className={`w-full shadow-md ${
        theme === 'dark' 
          ? 'bg-[#1e293b] border border-blue-900/30 hover:bg-[#0f172a] text-white' 
          : 'bg-primary hover:bg-primary/90 text-white'
      } transition-all duration-300`}
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
