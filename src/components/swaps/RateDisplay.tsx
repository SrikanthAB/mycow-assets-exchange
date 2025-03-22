
import { RefreshCw, Sparkles } from "lucide-react";
import { Token } from "@/contexts/portfolio";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RateDisplayProps {
  fromToken: Token | null;
  toToken: Token | null;
  exchangeRate: number;
  onRefresh: () => void;
}

const RateDisplay = ({ 
  fromToken, 
  toToken, 
  exchangeRate, 
  onRefresh 
}: RateDisplayProps) => {
  if (!fromToken || !toToken) return null;
  
  return (
    <Card className="flex justify-between items-center text-sm text-muted-foreground mb-6 bg-muted/30 p-3 rounded-lg border border-primary/10 shadow-md backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="text-primary h-4 w-4" />
        <span>Exchange Rate</span>
      </div>
      <div className="flex items-center">
        <Badge variant="outline" className="font-normal mr-2 border-primary/20 bg-primary/5">
          1 {fromToken.symbol} = {exchangeRate.toFixed(4)} {toToken.symbol}
        </Badge>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 hover:bg-primary/10" 
          onClick={onRefresh}
        >
          <RefreshCw className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
};

export default RateDisplay;
