
import { Token } from "@/contexts/portfolio";

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
    <div className="flex justify-between mb-2">
      <label className="text-sm font-medium">{label}</label>
      {balance && selectedToken && (
        <div className="text-sm text-muted-foreground">
          Balance: {selectedToken.balance.toFixed(4)} {selectedToken.symbol}
        </div>
      )}
    </div>
  );
};

export default TokenSelector;
