
import { Token } from "@/contexts/portfolio/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TokenSelectorProps {
  selectedToken: Token | null;
  tokens: Token[];
  onTokenChange: (tokenId: string) => void;
}

const TokenSelector = ({ selectedToken, tokens, onTokenChange }: TokenSelectorProps) => {
  if (tokens.length === 0) {
    return <div className="text-sm text-muted-foreground">No tokens available</div>;
  }
  
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Select Token</label>
      <Select
        value={selectedToken?.id || ''}
        onValueChange={onTokenChange}
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
  );
};

export default TokenSelector;
