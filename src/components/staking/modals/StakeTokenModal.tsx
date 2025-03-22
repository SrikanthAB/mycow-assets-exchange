
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Token } from "@/contexts/portfolio/types";
import { useStakeToken } from "./hooks/useStakeToken";
import TokenSelector from "./TokenSelector";
import TokenAmountInput from "./TokenAmountInput";
import YieldDisplay from "./YieldDisplay";
import StakingOptions from "./StakingOptions";
import NoTokensAvailable from "./NoTokensAvailable";

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
  // If no tokens are available, show the NoTokensAvailable component
  if (tokens.length === 0) {
    return <NoTokensAvailable open={open} onOpenChange={onOpenChange} />;
  }
  
  const {
    selectedToken,
    amount,
    autoCompound,
    yieldRedirect,
    isProcessing,
    currentYield,
    compoundBenefit,
    handleTokenChange,
    setAmount,
    setAutoCompound,
    setYieldRedirect,
    handleStake
  } = useStakeToken({
    initialToken,
    tokens,
    strategy,
    onOpenChange
  });
  
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
          <TokenSelector 
            selectedToken={selectedToken}
            tokens={tokens}
            onTokenChange={handleTokenChange}
          />
          
          {selectedToken && (
            <>
              <YieldDisplay 
                selectedToken={selectedToken}
                amount={amount}
                currentYield={currentYield}
              />
              
              <TokenAmountInput 
                selectedToken={selectedToken}
                amount={amount}
                setAmount={setAmount}
              />
              
              <StakingOptions
                autoCompound={autoCompound}
                setAutoCompound={setAutoCompound}
                yieldRedirect={yieldRedirect}
                setYieldRedirect={setYieldRedirect}
                strategy={strategy}
                currentYield={currentYield}
                compoundBenefit={compoundBenefit}
              />
            </>
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
