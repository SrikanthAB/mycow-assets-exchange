
import React, { useState } from "react";
import { TrendingUp, TrendingDown, Lock, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AssetDetailsModal from "@/components/asset-details/AssetDetailsModal";

export interface AssetCardProps {
  name: string;
  symbol: string;
  image?: string;
  price: string | number;
  change: number;
  category: string;
  yield?: string;
  // Portfolio specific props
  balance?: number;
  lockedAmount?: number;
  locked?: boolean;
  loanId?: string;
  // Optional props for different use cases
  onBuy?: () => void;
  onSell?: () => void;
  showBalance?: boolean;
  showActions?: boolean;
  // Optional id for database references
  id?: string;
}

const AssetCard = ({
  id,
  name,
  symbol,
  image,
  price,
  change,
  category,
  yield: yieldValue,
  balance,
  lockedAmount,
  locked,
  onBuy,
  onSell,
  showBalance = false,
  showActions = true
}: AssetCardProps) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const isPositiveChange = change >= 0;
  
  // Format price if it's a number
  const priceString = typeof price === 'string' ? price : `₹${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  
  // Calculate values for portfolio view
  const tokenValue = typeof price === 'number' && balance ? price * balance : undefined;
  const availableBalance = locked && lockedAmount && balance ? balance - lockedAmount : balance;
  const availableValue = typeof price === 'number' && availableBalance ? price * availableBalance : undefined;
  
  const openDetailsModal = () => {
    setDetailsModalOpen(true);
  };
  
  return (
    <div className="asset-card bg-[#0f172a] text-white rounded-xl p-6 shadow-md hover:shadow-lg group hover-elevate transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center overflow-hidden">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-medium">
                {symbol.substring(0, 2)}
              </div>
            )}
          </div>
          <div className="ml-3">
            <div className="flex items-center">
              <h4 className="font-medium text-white">{name}</h4>
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
              {locked && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Lock size={16} className="ml-2 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{lockedAmount} {symbol} locked as collateral</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="text-xs text-blue-300/80 flex items-center">
              <span className="bg-blue-800/50 px-1.5 py-0.5 rounded text-xs mr-2">{category}</span>
              <span>{symbol}</span>
            </div>
          </div>
        </div>
        
        {showBalance && balance !== undefined ? (
          <div className="text-right">
            <div className="text-sm text-gray-400">Balance</div>
            <div className="text-white">{balance.toLocaleString('en-IN', { maximumFractionDigits: 4 })} {symbol}</div>
            {locked && availableBalance !== undefined && (
              <div className="text-xs text-amber-500">
                ({availableBalance.toLocaleString('en-IN', { maximumFractionDigits: 4 })} available)
              </div>
            )}
          </div>
        ) : null}
      </div>
      
      <div className={cn(
        "mt-4 flex items-end justify-between",
        showBalance && "border-t border-blue-900/50 pt-4"
      )}>
        <div>
          {showBalance && tokenValue !== undefined ? (
            <>
              <div className="text-sm text-gray-400">Current Value</div>
              <div className="text-xl font-semibold text-white">₹{tokenValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
              {locked && availableValue !== undefined && (
                <div className="text-xs text-amber-500">
                  (₹{availableValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })} available)
                </div>
              )}
            </>
          ) : (
            <div className="text-xl font-semibold text-white">{priceString}</div>
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
            {isPositiveChange ? "+" : ""}{change}%
          </div>
        </div>
        
        {yieldValue && (
          <div className="text-right">
            <div className="text-sm text-gray-400">
              {showBalance ? "Estimated Yield" : "Yield"}
            </div>
            <div className="font-medium text-green-500">{yieldValue}</div>
          </div>
        )}
      </div>
      
      {showActions && (onBuy || onSell) && (
        <div className="mt-4 pt-4 border-t border-blue-900/50">
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            onClick={onBuy || onSell}
            disabled={locked && onSell && (!availableBalance || availableBalance <= 0)}
            variant={(locked && onSell && (!availableBalance || availableBalance <= 0)) ? "outline" : "default"}
          >
            {locked && onSell && (!availableBalance || availableBalance <= 0)
              ? "Locked"
              : onBuy
                ? "Buy Token"
                : "Sell Asset"}
          </Button>
        </div>
      )}
      
      {/* Asset Details Modal */}
      <AssetDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        asset={{
          id: id || symbol,
          name,
          symbol,
          category,
          price: priceString,
          change,
          yield: yieldValue
        }}
      />
    </div>
  );
};

export default AssetCard;
