
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Token, usePortfolio } from "@/contexts/portfolio";
import TokenSelector from "./TokenSelector";
import RateDisplay from "./RateDisplay";

interface SwapFormProps {
  tokens: Token[];
}

const SwapForm = ({ tokens }: SwapFormProps) => {
  const { updateTokenBalance, addTransaction } = usePortfolio();
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (tokens.length >= 2) {
      setFromToken(tokens[0]);
      setToToken(tokens[1]);
    }
  }, [tokens]);
  
  useEffect(() => {
    if (fromToken && toToken) {
      calculateExchangeRate();
    }
  }, [fromToken, toToken, fromAmount]);
  
  const calculateExchangeRate = () => {
    if (!fromToken || !toToken) return;
    
    // Calculate exchange rate with a small random variation
    const baseRate = fromToken.price / toToken.price;
    const variation = 0.98 + Math.random() * 0.04; // Random between 0.98 and 1.02
    const rate = baseRate * variation;
    setExchangeRate(rate);
    
    // Update to amount based on from amount and rate
    if (fromAmount > 0) {
      setToAmount(fromAmount * rate);
    }
  };
  
  const handleFromTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = tokens.find(t => t.id === e.target.value) || null;
    setFromToken(selected);
    
    // Don't allow same token to be selected for both fields
    if (selected && toToken && selected.id === toToken.id) {
      const nextToken = tokens.find(t => t.id !== selected.id) || null;
      setToToken(nextToken);
    }
  };
  
  const handleToTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = tokens.find(t => t.id === e.target.value) || null;
    setToToken(selected);
    
    // Don't allow same token to be selected for both fields
    if (selected && fromToken && selected.id === fromToken.id) {
      const nextToken = tokens.find(t => t.id !== selected.id) || null;
      setFromToken(nextToken);
    }
  };
  
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFromAmount(value);
    if (exchangeRate && value > 0) {
      setToAmount(value * exchangeRate);
    } else {
      setToAmount(0);
    }
  };
  
  const handleSwap = () => {
    if (!fromToken || !toToken || fromAmount <= 0) return;
    
    // Check if user has enough balance
    if (fromToken.balance < fromAmount) {
      toast({
        title: "Insufficient balance",
        description: `You don't have enough ${fromToken.symbol} tokens for this swap.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsSwapping(true);
    
    // Simulate transaction processing
    setTimeout(async () => {
      // Update balances
      updateTokenBalance(fromToken.id, -fromAmount);
      updateTokenBalance(toToken.id, toAmount);
      
      // Add sell transaction for fromToken
      await addTransaction({
        type: 'sell',
        asset: fromToken.name,
        amount: fromAmount,
        value: fromAmount * fromToken.price,
        status: 'completed'
      });
      
      // Add buy transaction for toToken
      await addTransaction({
        type: 'buy',
        asset: toToken.name,
        amount: toAmount,
        value: toAmount * toToken.price,
        status: 'completed'
      });
      
      // Show success message
      toast({
        title: "Swap successful",
        description: `Swapped ${fromAmount} ${fromToken.symbol} for ${toAmount.toFixed(4)} ${toToken.symbol}`,
      });
      
      // Reset form
      setFromAmount(0);
      setToAmount(0);
      setIsSwapping(false);
    }, 1500);
  };
  
  const switchTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    if (fromAmount > 0) {
      setFromAmount(toAmount);
      setToAmount(fromAmount);
    }
  };
  
  const refreshRate = () => {
    calculateExchangeRate();
  };
  
  return (
    <div className="bg-background rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <TokenSelector 
          tokens={tokens}
          selectedToken={fromToken}
          onChange={handleFromTokenChange}
          label="From"
        />
        
        <div className="flex gap-2 mb-4">
          <Input
            type="number"
            value={fromAmount || ""}
            onChange={handleFromAmountChange}
            placeholder="0.0"
            min="0"
            step="0.01"
            className="flex-1"
          />
          
          <select 
            className="bg-muted rounded-md px-3 py-2 text-sm"
            value={fromToken?.id || ""}
            onChange={handleFromTokenChange}
          >
            {tokens.map(token => (
              <option key={token.id} value={token.id}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={switchTokens}
          className="bg-muted/50 hover:bg-muted w-10 h-10 rounded-full flex items-center justify-center mx-auto my-2"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
        
        <TokenSelector 
          tokens={tokens}
          selectedToken={toToken}
          onChange={handleToTokenChange}
          label="To"
        />
        
        <div className="flex gap-2">
          <Input
            type="number"
            value={toAmount ? toAmount.toFixed(4) : ""}
            placeholder="0.0"
            readOnly
            className="flex-1 bg-muted/30"
          />
          
          <select 
            className="bg-muted rounded-md px-3 py-2 text-sm"
            value={toToken?.id || ""}
            onChange={handleToTokenChange}
          >
            {tokens.map(token => (
              <option key={token.id} value={token.id}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {fromToken && toToken && (
        <RateDisplay 
          fromToken={fromToken}
          toToken={toToken}
          exchangeRate={exchangeRate}
          onRefresh={refreshRate}
        />
      )}
      
      <Button 
        className="w-full" 
        disabled={!fromToken || !toToken || fromAmount <= 0 || fromAmount > (fromToken?.balance || 0) || isSwapping}
        onClick={handleSwap}
      >
        {isSwapping ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Swapping...
          </>
        ) : fromAmount > (fromToken?.balance || 0) ? (
          "Insufficient Balance"
        ) : (
          "Swap Tokens"
        )}
      </Button>
    </div>
  );
};

export default SwapForm;
