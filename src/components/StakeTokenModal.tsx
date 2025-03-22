
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight } from "lucide-react";
import { Token } from "@/contexts/portfolio/types";

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
  const [selectedToken, setSelectedToken] = useState<Token | null>(initialToken);
  const [amount, setAmount] = useState<number>(initialToken?.balance || 0);
  const [autoCompound, setAutoCompound] = useState<boolean>(true);
  const [yieldRedirect, setYieldRedirect] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();
  
  const token = selectedToken || initialToken || tokens[0];
  const currentYield = token?.yield ? parseFloat(token.yield.replace(/[^0-9.]/g, '')) : 0;
  const strategyYield = strategy ? parseFloat(strategy.expectedReturn.split('-')[1]) : 0;
  const compoundBenefit = yieldRedirect ? (strategyYield - currentYield) : 0;
  
  const handleStake = () => {
    if (!token || !amount || amount <= 0 || amount > token.balance) return;
    
    setIsProcessing(true);
    
    // Simulate staking process
    setTimeout(() => {
      toast({
        title: "Tokens Staked Successfully",
        description: `You have staked ${amount} ${token.symbol} tokens with ${autoCompound ? 'auto-compounding' : 'manual'} ${yieldRedirect && strategy ? `and yield redirected to ${strategy.name} strategy` : ''}`,
      });
      
      setIsProcessing(false);
      onOpenChange(false);
    }, 1500);
  };
  
  if (!token) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Stake {token.name}</DialogTitle>
          <DialogDescription>
            Configure staking options for your {token.symbol} tokens
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Current Yield</label>
            <div className="p-3 bg-muted rounded-md font-medium text-green-600">{token.yield || "0% APY"}</div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">
              Amount to Stake
            </label>
            <Input
              type="number"
              min={0.1}
              max={token.balance}
              step={0.1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <div className="mt-1 text-xs text-muted-foreground flex justify-between">
              <span>Available: {token.balance} {token.symbol}</span>
              <button 
                className="text-primary text-xs"
                onClick={() => setAmount(token.balance)}
              >
                Max
              </button>
            </div>
          </div>
          
          <div className="p-3 bg-muted/30 rounded-md">
            <div className="flex justify-between">
              <span>Estimated Annual Yield</span>
              <span className="font-medium text-green-600">
                ₹{((token.price * amount * currentYield) / 100).toLocaleString('en-IN', {maximumFractionDigits: 2})}
              </span>
            </div>
          </div>
          
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
          
          {yieldRedirect && strategy && (
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
            disabled={!amount || amount <= 0 || amount > token.balance || isProcessing}
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
