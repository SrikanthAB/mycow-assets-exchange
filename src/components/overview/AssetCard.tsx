
import React from "react";
import { Token } from "@/contexts/PortfolioContext";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssetCardProps {
  token: Token;
}

const AssetCard = ({ token }: AssetCardProps) => {
  const isPositiveChange = token.change >= 0;
  const tokenValue = token.price * token.balance;
  
  return (
    <div className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center overflow-hidden">
            {token.image ? (
              <img src={token.image} alt={token.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                {token.symbol.substring(0, 2)}
              </div>
            )}
          </div>
          <div className="ml-3">
            <h4 className="font-medium">{token.name}</h4>
            <div className="text-xs text-muted-foreground flex items-center">
              <span className="bg-secondary px-1.5 py-0.5 rounded text-xs mr-2">{token.category}</span>
              <span>{token.symbol}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-medium">Balance</div>
          <div>{token.balance.toLocaleString('en-IN', { maximumFractionDigits: 4 })} {token.symbol}</div>
        </div>
      </div>
      
      <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
        <div>
          <div className="text-sm text-muted-foreground">Current Value</div>
          <div className="text-xl font-semibold">₹{tokenValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          <div 
            className={cn(
              "flex items-center text-sm",
              isPositiveChange ? "text-green-600" : "text-red-500"
            )}
          >
            {isPositiveChange ? (
              <TrendingUp size={14} className="mr-1" />
            ) : (
              <TrendingDown size={14} className="mr-1" />
            )}
            {isPositiveChange ? "+" : ""}{token.change}%
          </div>
        </div>
        
        {token.yield && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Estimated Yield</div>
            <div className="font-medium text-green-600">{token.yield}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCard;
