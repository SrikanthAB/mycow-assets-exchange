
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePortfolio, Token } from "@/contexts/PortfolioContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Swaps = () => {
  const { tokens, updateTokenBalance } = usePortfolio();
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
      // Calculate exchange rate with a small random variation
      const baseRate = fromToken.price / toToken.price;
      const variation = 0.98 + Math.random() * 0.04; // Random between 0.98 and 1.02
      const rate = baseRate * variation;
      setExchangeRate(rate);
      
      // Update to amount based on from amount and rate
      if (fromAmount > 0) {
        setToAmount(fromAmount * rate);
      }
    }
  }, [fromToken, toToken, fromAmount]);
  
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
    setTimeout(() => {
      // Update balances
      updateTokenBalance(fromToken.id, -fromAmount);
      updateTokenBalance(toToken.id, toAmount);
      
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
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <h2>Swap Tokens</h2>
              <p className="mt-3 text-muted-foreground">
                Exchange your tokens for other assets at competitive rates with minimal slippage.
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="bg-background rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">From</label>
                    {fromToken && (
                      <div className="text-sm text-muted-foreground">
                        Balance: {fromToken.balance.toFixed(4)} {fromToken.symbol}
                      </div>
                    )}
                  </div>
                  
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
                  
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">To</label>
                    {toToken && (
                      <div className="text-sm text-muted-foreground">
                        Balance: {toToken.balance.toFixed(4)} {toToken.symbol}
                      </div>
                    )}
                  </div>
                  
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
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-6 bg-muted/30 p-3 rounded-lg">
                    <div>Exchange Rate</div>
                    <div className="flex items-center">
                      <span>1 {fromToken.symbol} = {exchangeRate.toFixed(4)} {toToken.symbol}</span>
                      <button className="ml-2 p-1 hover:bg-muted rounded-full" onClick={() => {
                        // Refresh rate with a small random variation
                        const baseRate = fromToken.price / toToken.price;
                        const variation = 0.98 + Math.random() * 0.04;
                        setExchangeRate(baseRate * variation);
                        if (fromAmount > 0) {
                          setToAmount(fromAmount * baseRate * variation);
                        }
                      }}>
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
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
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Swaps;
