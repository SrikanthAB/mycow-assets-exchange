
import { ArrowUpRight, TrendingUp, TrendingDown, Lock, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import AssetDetailsModal from "./AssetDetailsModal";

interface AssetCardProps {
  name: string;
  symbol: string;
  image: string; 
  price: string;
  change: number;
  category: string;
  yield?: string;
  onBuy?: () => void;
  locked?: boolean;
}

const AssetCard = ({ name, symbol, image, price, change, category, yield: yieldValue, onBuy, locked }: AssetCardProps) => {
  const isPositiveChange = change >= 0;
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  return (
    <div className="asset-card bg-[#0f172a] text-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
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
              {locked && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Lock size={16} className="ml-2 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">This asset is locked as collateral for a loan</p>
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
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsDetailsOpen(true)}
                  className="p-1.5 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  <Info size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">View asset details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-xl font-semibold text-white">{price}</div>
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
            <div className="text-sm text-gray-400">Yield</div>
            <div className="font-medium text-green-500">{yieldValue}</div>
          </div>
        )}
      </div>
      
      {onBuy && (
        <div className="mt-4 pt-4 border-t border-blue-900/50">
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            size="sm"
            onClick={onBuy}
            disabled={locked}
          >
            {locked ? "Locked" : "Buy Token"}
          </Button>
        </div>
      )}

      <AssetDetailsModal
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        asset={{ id: symbol, name, symbol, category, price, change, yield: yieldValue }}
      />
    </div>
  );
};

export default AssetCard;
