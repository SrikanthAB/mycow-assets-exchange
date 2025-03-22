
import { Coins } from "lucide-react";
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
        <SelectTrigger className="w-full bg-secondary/80 border-secondary-foreground/10">
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
                  <Coins className="w-5 h-5 text-primary" />
                )}
                <span>{selectedToken.symbol}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-card border-primary/10 shadow-lg">
          {tokens.map(token => (
            <SelectItem 
              key={token.id} 
              value={token.id}
              className="flex items-center gap-2 py-3 hover:bg-secondary/50 focus:bg-secondary/50"
            >
              <div className="flex items-center gap-2">
                {token.image ? (
                  <img 
                    src={token.image} 
                    alt={token.name} 
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <Coins className="w-5 h-5 text-primary" />
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
