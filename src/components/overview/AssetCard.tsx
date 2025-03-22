
import React, { useState } from "react";
import { Token } from "@/contexts/portfolio/types";
import { TrendingUp, TrendingDown, Lock, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SellAssetModal from "./SellAssetModal";
import AssetDetailsModal from "@/components/AssetDetailsModal";

interface AssetCardProps {
  token: Token;
}

const AssetCard = ({ token }: AssetCardProps) => {
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
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

  const openDetailsModal = () => {
    setDetailsModalOpen(true);
  };
  
  return (
    <div className="asset-card bg-[#0f172a] text-white rounded-xl p-6 shadow-md hover:shadow-lg group hover-elevate transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center overflow-hidden">
            {token.image ? (
              <img src={token.image} alt={token.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-medium">
                {token.symbol.substring(0, 2)}
              </div>
            )}
          </div>
          <div className="ml-3">
            <div className="flex items-center">
              <h4 className="font-medium text-white">{token.name}</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={openDetailsModal}
                      className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Info size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View asset details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
            <div className="text-xs text-blue-300/80 flex items-center">
              <span className="bg-blue-800/50 px-1.5 py-0.5 rounded text-xs mr-2">{token.category}</span>
              <span>{token.symbol}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-400">Balance</div>
          <div className="text-white">{token.balance.toLocaleString('en-IN', { maximumFractionDigits: 4 })} {token.symbol}</div>
          {token.locked && (
            <div className="text-xs text-amber-500">
              ({availableBalance.toLocaleString('en-IN', { maximumFractionDigits: 4 })} available)
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex items-end justify-between border-t border-blue-900/50 pt-4">
        <div>
          <div className="text-sm text-gray-400">Current Value</div>
          <div className="text-xl font-semibold text-white">₹{tokenValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          {token.locked && (
            <div className="text-xs text-amber-500">
              (₹{availableValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })} available)
            </div>
          )}
          <div 
            className={cn(
              "flex items-center text-sm",
              isPositiveChange ? "text-green-500" : "text-red-500"
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
            <div className="text-sm text-gray-400">Estimated Yield</div>
            <div className="font-medium text-green-500">{token.yield}</div>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-blue-900/50">
        <Button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
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

      {/* Asset Details Modal */}
      <AssetDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        asset={{
          id: token.id,
          name: token.name,
          symbol: token.symbol,
          category: token.category,
          price: token.priceString || token.price.toString(),
          change: token.change,
          yield: token.yield
        }}
      />
    </div>
  );
};

export default AssetCard;
