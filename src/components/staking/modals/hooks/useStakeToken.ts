
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePortfolio } from "@/contexts/portfolio/usePortfolio";
import { Token } from "@/contexts/portfolio/types";

interface StakeTokenParams {
  initialToken: Token | null;
  tokens: Token[];
  strategy?: {
    id: string;
    name: string;
    description: string;
    expectedReturn: string;
    assets: string[];
    risk: string;
  };
  onOpenChange: (open: boolean) => void;
}

export const useStakeToken = ({ initialToken, tokens, strategy, onOpenChange }: StakeTokenParams) => {
  // Use initialToken if provided, otherwise use the first token from the list if available
  const [selectedToken, setSelectedToken] = useState<Token | null>(
    initialToken || (tokens.length > 0 ? tokens[0] : null)
  );
  
  const [amount, setAmount] = useState<number>(0);
  const [autoCompound, setAutoCompound] = useState<boolean>(true);
  const [yieldRedirect, setYieldRedirect] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();
  const { toggleTokenStaking, addTransaction } = usePortfolio();
  
  // Update amount when selectedToken changes
  useEffect(() => {
    if (selectedToken) {
      setAmount(selectedToken.balance);
    } else {
      setAmount(0);
    }
  }, [selectedToken]);
  
  // Safely get the token yield rate
  const currentYield = selectedToken?.yield 
    ? parseFloat(selectedToken.yield.replace(/[^0-9.]/g, '')) 
    : 0;
    
  const strategyYield = strategy 
    ? parseFloat(strategy.expectedReturn.split('-')[1]) 
    : 0;
    
  const compoundBenefit = yieldRedirect ? (strategyYield - currentYield) : 0;
  
  // Handle token selection change
  const handleTokenChange = (tokenId: string) => {
    const newToken = tokens.find(t => t.id === tokenId) || null;
    setSelectedToken(newToken);
  };
  
  const handleStake = async () => {
    if (!selectedToken || !amount || amount <= 0 || amount > selectedToken.balance) return;
    
    setIsProcessing(true);
    
    try {
      // Calculate yield rate based on strategy
      const yieldRate = yieldRedirect && strategy 
        ? `${strategyYield}% APY`
        : `${currentYield || 5}% APY`;
      
      // Toggle token staking status
      toggleTokenStaking(selectedToken.id, true, yieldRate);
      
      // Add transaction record
      await addTransaction({
        type: 'stake',
        asset: selectedToken.id,
        amount: amount,
        value: selectedToken.price * amount,
        status: 'completed',
      });
      
      toast({
        title: "Tokens Staked Successfully",
        description: `You have staked ${amount} ${selectedToken.symbol} tokens with ${autoCompound ? 'auto-compounding' : 'manual'} ${yieldRedirect && strategy ? `and yield redirected to ${strategy.name} strategy` : ''}`,
      });
    } catch (error) {
      console.error("Error staking tokens:", error);
      toast({
        title: "Error Staking Tokens",
        description: "There was an error staking your tokens. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      onOpenChange(false);
    }
  };

  return {
    selectedToken,
    amount,
    autoCompound,
    yieldRedirect,
    isProcessing,
    currentYield,
    strategyYield,
    compoundBenefit,
    handleTokenChange,
    setAmount,
    setAutoCompound,
    setYieldRedirect,
    handleStake
  };
};
