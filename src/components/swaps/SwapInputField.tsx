
import { Input } from "@/components/ui/input";
import { Token } from "@/contexts/portfolio";
import TokenSelector from "./TokenSelector";
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SwapInputFieldProps {
  amount: number | string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  token: Token | null;
  onTokenChange: (tokenId: string) => void;
  tokens: Token[];
  readOnly?: boolean;
  placeholder?: string;
}

const SwapInputField = ({ 
  amount, 
  onChange, 
  token, 
  onTokenChange, 
  tokens,
  readOnly = false,
  placeholder = "0.0"
}: SwapInputFieldProps) => {
  // Check if token is locked
  const isLocked = token?.locked && token?.lockedAmount && token?.lockedAmount >= token?.balance;
  
  return (
    <div className="mt-2 mb-4 bg-secondary/20 p-4 rounded-xl border border-secondary/30">
      <TokenSelector
        tokens={tokens}
        selectedToken={token}
        onChange={onTokenChange}
        label="Select Token"
        balance={true}
      />
      
      <div className="mt-3 relative">
        <Input
          type="number"
          value={amount || ""}
          onChange={onChange}
          placeholder={placeholder}
          min="0"
          step="0.01"
          className={`w-full bg-white border-secondary/20 focus:border-primary/40 ${readOnly || isLocked ? "bg-muted/30" : ""}`}
          readOnly={readOnly || isLocked}
        />
        
        {isLocked && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Lock size={16} className="text-amber-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">This token is locked as collateral</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapInputField;
