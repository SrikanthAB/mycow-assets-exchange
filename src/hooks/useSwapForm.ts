
import { useState, useEffect } from "react";
import { Token, usePortfolio } from "@/contexts/portfolio";
import { useToast } from "@/components/ui/use-toast";

export const useSwapForm = (tokens: Token[]) => {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  const { updateTokenBalance, addToken, addTransaction } = usePortfolio();
  const { toast } = useToast();

  // Set initial tokens if available
  useEffect(() => {
    if (tokens.length > 0) {
      if (!fromToken) setFromToken(tokens[0]);
      if (!toToken && tokens.length > 1) setToToken(tokens[1]);
    }
  }, [tokens]);

  // Calculate exchange rate and to amount when dependencies change
  useEffect(() => {
    if (fromToken && toToken) {
      calculateExchangeRate();
    }
  }, [fromToken, toToken, fromAmount]);

  const calculateExchangeRate = () => {
    if (!fromToken || !toToken) return;

    // Add small random variation to simulate market fluctuations
    const baseRate = fromToken.price / toToken.price;
    const variation = 0.01 * (Math.random() * 2 - 1); // Random variation between -1% and +1%
    const rate = baseRate * (1 + variation);
    
    setExchangeRate(rate);
    
    if (fromAmount > 0) {
      // Apply a 0.5% swap fee
      const swapFee = 0.005;
      const calculatedAmount = (fromAmount * rate) * (1 - swapFee);
      setToAmount(calculatedAmount);
    } else {
      setToAmount(0);
    }
  };

  const handleFromTokenChange = (token: Token) => {
    if (token.id === toToken?.id) {
      // If same as to token, swap them
      setFromToken(toToken);
      setToToken(fromToken);
    } else {
      setFromToken(token);
    }
  };

  const handleToTokenChange = (token: Token) => {
    if (token.id === fromToken?.id) {
      // If same as from token, swap them
      setToToken(fromToken);
      setFromToken(toToken);
    } else {
      setToToken(token);
    }
  };

  const handleFromAmountChange = (value: string) => {
    const amount = parseFloat(value);
    if (isNaN(amount)) {
      setFromAmount(0);
      setToAmount(0);
    } else {
      setFromAmount(amount);
    }
  };

  const switchTokens = () => {
    const tempFromToken = fromToken;
    const tempToToken = toToken;
    setFromToken(tempToToken);
    setToToken(tempFromToken);
    
    // Reset amounts
    if (toAmount !== null) {
      setFromAmount(toAmount);
    }
  };

  const refreshRate = () => {
    calculateExchangeRate();
    
    toast({
      title: "Rate Updated",
      description: "The exchange rate has been refreshed with the latest market data."
    });
  };

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || fromAmount <= 0 || !toAmount) {
      toast({
        title: "Invalid swap parameters",
        description: "Please ensure all swap details are correctly specified.",
        variant: "destructive"
      });
      return;
    }

    if (fromAmount > fromToken.balance) {
      toast({
        title: "Insufficient balance",
        description: `You don't have enough ${fromToken.symbol} to complete this swap.`,
        variant: "destructive"
      });
      return;
    }

    setIsSwapping(true);

    try {
      // Deduct from source token
      updateTokenBalance(fromToken.id, -fromAmount);

      // Add to destination token if it exists in portfolio, otherwise add it
      const existingToken = tokens.find(t => t.id === toToken.id);
      if (existingToken) {
        updateTokenBalance(toToken.id, toAmount);
      } else {
        const newToken = {
          ...toToken,
          balance: toAmount
        };
        addToken(newToken);
      }

      // Record transaction
      await addTransaction({
        type: 'swap',
        asset: fromToken.id,
        toAsset: toToken.id,
        amount: fromAmount,
        value: fromToken.price * fromAmount,
        status: 'completed'
      });

      toast({
        title: "Swap Successful",
        description: `Swapped ${fromAmount} ${fromToken.symbol} for ${toAmount.toFixed(4)} ${toToken.symbol}`
      });

      // Reset form
      setFromAmount(0);
      setToAmount(0);
    } catch (error) {
      console.error("Error performing swap:", error);
      toast({
        title: "Swap Failed",
        description: "There was an error processing your swap. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSwapping(false);
    }
  };

  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    exchangeRate,
    isSwapping,
    handleFromTokenChange,
    handleToTokenChange,
    handleFromAmountChange,
    handleSwap,
    switchTokens,
    refreshRate
  };
};
