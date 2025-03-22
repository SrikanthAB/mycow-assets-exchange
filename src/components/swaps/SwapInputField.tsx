
import { Input } from "@/components/ui/input";
import { Token } from "@/contexts/portfolio";

interface SwapInputFieldProps {
  amount: number | string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  token: Token | null;
  onTokenChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
    <div className="flex gap-2">
      <Input
        type="number"
        value={amount || ""}
        onChange={onChange}
        placeholder={placeholder}
        min="0"
        step="0.01"
        className={`flex-1 ${readOnly ? "bg-muted/30" : ""}`}
        readOnly={readOnly}
      />
      
      <select 
        className="bg-muted rounded-md px-3 py-2 text-sm"
        value={token?.id || ""}
        onChange={onTokenChange}
      >
        {tokens.map(token => (
          <option key={token.id} value={token.id}>
            {token.symbol}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SwapInputField;
