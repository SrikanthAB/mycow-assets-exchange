
import React, { useState } from "react";
import { Token } from "@/contexts/portfolio/types";
import { TrendingUp, TrendingDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SellAssetModal from "./SellAssetModal";

interface AssetCardProps {
  token: Token;
}

const AssetCard = ({ token }: AssetCardProps) => {
  const [sellModalOpen, setSellModalOpen] = useState(false);
  
  const isPositiveChange = token.change >= 0;
  const tokenValue = token.price * token.balance;
  const availableBalance = token.locked && token.lockedAmount ? token.balance - token.lockedAmount : token.balance;
  const availableValue = token.price * availableBalance;
  
  const openSellModal = () => {
    setSellModalOpen(true);
  };
  
  const closeSellModal = () => {
    setSellModalOpen(false);
  };
  
  return (
    <div className="asset-card glass-effect group hover-elevate bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center overflow-hidden">
            {token.image ? (
              <img src={token.image} alt={token.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center text-white font-medium">
                {token.symbol.substring(0, 2)}
              </div>
            )}
          </div>
          <div className="ml-3">
            <div className="flex items-center">
              <h4 className="font-medium">{token.name}</h4>
              {token.locked && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Lock size={16} className="ml-2 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{token.lockedAmount} {token.symbol} locked as collateral</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="text-xs text-muted-foreground flex items-center">
              <span className="bg-secondary px-1.5 py-0.5 rounded text-xs mr-2">{token.category}</span>
              <span>{token.symbol}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-medium">Balance</div>
          <div>{token.balance.toLocaleString('en-IN', { maximumFractionDigits: 4 })} {token.symbol}</div>
          {token.locked && (
            <div className="text-xs text-amber-500">
              ({availableBalance.toLocaleString('en-IN', { maximumFractionDigits: 4 })} available)
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
        <div>
          <div className="text-sm text-muted-foreground">Current Value</div>
          <div className="text-xl font-semibold">₹{tokenValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          {token.locked && (
            <div className="text-xs text-amber-500">
              (₹{availableValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })} available)
            </div>
          )}
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
      
      <div className="mt-4 pt-4 border-t border-border">
        <Button 
          className="w-full"
          onClick={openSellModal}
          disabled={token.locked && availableBalance <= 0}
          variant={token.locked && availableBalance <= 0 ? "outline" : "default"}
        >
          {token.locked && availableBalance <= 0 ? "Locked" : "Sell Asset"}
        </Button>
      </div>
      
      {/* Sell Asset Modal */}
      <SellAssetModal 
        isOpen={sellModalOpen} 
        onClose={closeSellModal} 
        token={token} 
      />
    </div>
  );
};

export default AssetCard;
