
import { Input } from "@/components/ui/input";
import { Token } from "@/contexts/portfolio";
import TokenSelector from "./TokenSelector";
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/components/ui/theme-provider";

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
  const { theme } = useTheme();
  // Check if token is locked
  const isLocked = token?.locked && token?.lockedAmount && token?.lockedAmount >= token?.balance;
  
  return (
    <div className={`mt-2 mb-4 ${theme === 'dark' ? 'bg-[#1e293b]' : 'bg-gray-50'} p-4 rounded-xl ${theme === 'dark' ? 'border border-blue-900/30' : 'border border-gray-200'}`}>
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
          className={`w-full ${theme === 'dark' 
            ? 'bg-[#0f172a] border-blue-900/30 focus:border-primary/40 text-white' 
            : 'bg-white border-gray-200 focus:border-primary/40 text-gray-900'} ${readOnly || isLocked ? (theme === 'dark' ? 'bg-[#0f172a]/70' : 'bg-gray-100') : ''}`}
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
