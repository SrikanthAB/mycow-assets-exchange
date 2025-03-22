
import { Token } from "@/contexts/portfolio/types";

interface YieldDisplayProps {
  selectedToken: Token;
  amount: number;
  currentYield: number;
}

const YieldDisplay = ({ selectedToken, amount, currentYield }: YieldDisplayProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Current Yield</label>
      <div className="p-3 bg-muted rounded-md font-medium text-green-600">{selectedToken.yield || "0% APY"}</div>
      
      <div className="p-3 bg-muted/30 rounded-md mt-4">
        <div className="flex justify-between">
          <span>Estimated Annual Yield</span>
          <span className="font-medium text-green-600">
            ₹{((selectedToken.price * amount * currentYield) / 100).toLocaleString('en-IN', {maximumFractionDigits: 2})}
          </span>
        </div>
      </div>
    </div>
  );
};

export default YieldDisplay;
