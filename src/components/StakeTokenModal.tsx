
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Token } from "@/contexts/portfolio/types";
import { usePortfolio } from "@/contexts/portfolio/usePortfolio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StakeTokenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokens: Token[];
  initialToken: Token | null;
  strategy?: {
    id: string;
    name: string;
    description: string;
    expectedReturn: string;
    assets: string[];
    risk: string;
  };
}

const StakeTokenModal = ({ open, onOpenChange, tokens, initialToken, strategy }: StakeTokenModalProps) => {
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
  
  if (tokens.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>No Available Tokens</DialogTitle>
            <DialogDescription>
              You don't have any unstaked tokens available
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Stake Token</DialogTitle>
          <DialogDescription>
            Configure staking options for your tokens
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Token</label>
            <Select
              value={selectedToken?.id || ''}
              onValueChange={handleTokenChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a token to stake">
                  {selectedToken ? `${selectedToken.name} (${selectedToken.symbol})` : "Select a token"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tokens.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} ({t.symbol}) - Balance: {t.balance}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedToken && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Current Yield</label>
                <div className="p-3 bg-muted rounded-md font-medium text-green-600">{selectedToken.yield || "0% APY"}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Amount to Stake
                </label>
                <Input
                  type="number"
                  min={0.1}
                  max={selectedToken.balance}
                  step={0.1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
                <div className="mt-1 text-xs text-muted-foreground flex justify-between">
                  <span>Available: {selectedToken.balance} {selectedToken.symbol}</span>
                  <button 
                    className="text-primary text-xs"
                    onClick={() => setAmount(selectedToken.balance)}
                  >
                    Max
                  </button>
                </div>
              </div>
              
              <div className="p-3 bg-muted/30 rounded-md">
                <div className="flex justify-between">
                  <span>Estimated Annual Yield</span>
                  <span className="font-medium text-green-600">
                    ₹{((selectedToken.price * amount * currentYield) / 100).toLocaleString('en-IN', {maximumFractionDigits: 2})}
                  </span>
                </div>
              </div>
            </>
          )}
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="auto-compound" className="flex flex-col">
                <span>Auto-Compound Rewards</span>
                <span className="font-normal text-xs text-muted-foreground">Automatically reinvest yield into the same token</span>
              </Label>
              <Switch
                id="auto-compound"
                checked={autoCompound}
                onCheckedChange={setAutoCompound}
              />
            </div>
            
            {strategy && (
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="yield-redirect" className="flex flex-col">
                  <span>Redirect Yield to {strategy.name} Strategy</span>
                  <span className="font-normal text-xs text-muted-foreground">Invest yield into {strategy.name.toLowerCase()} risk assets</span>
                </Label>
                <Switch
                  id="yield-redirect"
                  checked={yieldRedirect}
                  onCheckedChange={setYieldRedirect}
                />
              </div>
            )}
          </div>
          
          {selectedToken && yieldRedirect && strategy && (
            <div className="bg-primary/5 p-3 rounded-md border border-primary/20">
              <h4 className="text-sm font-medium flex items-center">
                <span>Current Yield</span>
                <ArrowRight className="mx-2 h-3 w-3" />
                <span>{strategy.name} Strategy</span>
              </h4>
              <div className="mt-2 text-sm flex justify-between">
                <span>{currentYield}% APY</span>
                <span className="text-primary">{strategy.expectedReturn}</span>
              </div>
              <div className="mt-2 text-xs bg-primary/10 text-primary p-2 rounded">
                Potential yield increase: +{compoundBenefit.toFixed(1)}% APY
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleStake} 
            disabled={!selectedToken || !amount || amount <= 0 || amount > (selectedToken?.balance || 0) || isProcessing}
            className={isProcessing ? "opacity-80" : ""}
          >
            {isProcessing ? "Processing..." : "Stake Tokens"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StakeTokenModal;
