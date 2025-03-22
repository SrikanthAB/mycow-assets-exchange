
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Token } from "@/contexts/portfolio";
import { useTheme } from "@/components/ui/theme-provider";
import { Wallet } from "lucide-react";
import { calculateCategoryBreakdown } from "../utils/stakingUtils";

interface StakedAssetsCardProps {
  stakedTokens: Token[];
  totalStakedValue: number;
  stakedPercentage: number;
}

const StakedAssetsCard = ({ stakedTokens, totalStakedValue, stakedPercentage }: StakedAssetsCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const sortedCategories = calculateCategoryBreakdown(stakedTokens, totalStakedValue);
  
  return (
    <Card className={isDark ? "border-blue-900/50" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Wallet size={18} className={isDark ? "text-blue-400" : "text-primary"} />
          <CardTitle className="text-lg">Staked Assets</CardTitle>
        </div>
        <CardDescription>
          Your portfolio of staked RWA tokens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${isDark ? "text-white" : ""}`}>
          ₹{totalStakedValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}
        </div>
        <div className="text-sm text-muted-foreground flex items-center justify-between mt-1">
          <span>{stakedTokens.length} tokens staked</span>
          <span className="font-medium">{stakedPercentage.toFixed(1)}% of portfolio</span>
        </div>
        
        {totalStakedValue > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm">Staked assets breakdown:</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {sortedCategories.map(({ category, percentage, color }) => (
                <div key={category} className="flex items-center p-1.5 rounded bg-primary/5">
                  <div className={`w-2 h-2 rounded-full bg-${color} mr-2`}></div>
                  <span>{category}: {percentage.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StakedAssetsCard;
