
import { Input } from "@/components/ui/input";
import { Token } from "@/contexts/portfolio";
import TokenSelector from "./TokenSelector";

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
  return (
    <div className="mt-2 mb-4 bg-secondary/20 p-4 rounded-xl border border-secondary/30">
      <TokenSelector
        tokens={tokens}
        selectedToken={token}
        onChange={onTokenChange}
        label="Select Token"
        balance={true}
      />
      
      <div className="mt-3">
        <Input
          type="number"
          value={amount || ""}
          onChange={onChange}
          placeholder={placeholder}
          min="0"
          step="0.01"
          className={`w-full bg-white border-secondary/20 focus:border-primary/40 ${readOnly ? "bg-muted/30" : ""}`}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default SwapInputField;
