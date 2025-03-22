
import { Input } from "@/components/ui/input";
import { Token } from "@/contexts/portfolio/types";

interface TokenAmountInputProps {
  selectedToken: Token;
  amount: number;
  setAmount: (amount: number) => void;
}

const TokenAmountInput = ({ selectedToken, amount, setAmount }: TokenAmountInputProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">
        Amount to Stake
      </label>
      <Input
        type="number"
        min={0.1}
        max={selectedToken.balance}
        step={0.1}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <div className="mt-1 text-xs text-muted-foreground flex justify-between">
        <span>Available: {selectedToken.balance} {selectedToken.symbol}</span>
        <button 
          className="text-primary text-xs"
          onClick={() => setAmount(selectedToken.balance)}
        >
          Max
        </button>
      </div>
    </div>
  );
};

export default TokenAmountInput;
