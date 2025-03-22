
import { Coin } from "lucide-react";
import { Token } from "@/contexts/portfolio";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onChange: (tokenId: string) => void;
  label: string;
  balance?: boolean;
}

const TokenSelector = ({ 
  tokens, 
  selectedToken, 
  onChange, 
  label,
  balance = true 
}: TokenSelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        {balance && selectedToken && (
          <div className="text-sm text-muted-foreground">
            Balance: {selectedToken.balance.toFixed(4)} {selectedToken.symbol}
          </div>
        )}
      </div>
      
      <Select
        value={selectedToken?.id || ""}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select token">
            {selectedToken && (
              <div className="flex items-center gap-2">
                {selectedToken.image ? (
                  <img 
                    src={selectedToken.image} 
                    alt={selectedToken.name} 
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <Coin className="w-5 h-5 text-muted-foreground" />
                )}
                <span>{selectedToken.symbol}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {tokens.map(token => (
            <SelectItem 
              key={token.id} 
              value={token.id}
              className="flex items-center gap-2 py-3"
            >
              <div className="flex items-center gap-2">
                {token.image ? (
                  <img 
                    src={token.image} 
                    alt={token.name} 
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <Coin className="w-5 h-5 text-muted-foreground" />
                )}
                <div className="flex flex-col">
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-xs text-muted-foreground">{token.name}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TokenSelector;
