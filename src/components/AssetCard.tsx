
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssetCardProps {
  name: string;
  symbol: string;
  image: string; 
  price: string;
  change: number;
  category: string;
  yield?: string;
}

const AssetCard = ({ name, symbol, image, price, change, category, yield: yieldValue }: AssetCardProps) => {
  const isPositiveChange = change >= 0;
  
  return (
    <div className="asset-card glass-effect group hover-elevate">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center overflow-hidden">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                {symbol.substring(0, 2)}
              </div>
            )}
          </div>
          <div className="ml-3">
            <h4 className="font-medium">{name}</h4>
            <div className="text-xs text-muted-foreground flex items-center">
              <span className="bg-secondary px-1.5 py-0.5 rounded text-xs mr-2">{category}</span>
              <span>{symbol}</span>
            </div>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20">
          <ArrowUpRight size={16} />
        </button>
      </div>
      
      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-xl font-semibold">{price}</div>
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
            {isPositiveChange ? "+" : ""}{change}%
          </div>
        </div>
        
        {yieldValue && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Yield</div>
            <div className="font-medium text-green-600">{yieldValue}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCard;
