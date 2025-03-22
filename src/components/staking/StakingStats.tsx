
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePortfolio } from "@/contexts/portfolio";
import { Token } from "@/contexts/portfolio";
import { useTheme } from "@/components/ui/theme-provider";
import { Wallet, TrendingUp, ArrowUpRight } from "lucide-react";

interface StakingStatsProps {
  stakedTokens: Token[];
}

const StakingStats = ({ stakedTokens }: StakingStatsProps) => {
  const { tokens, getTotalPortfolioValue } = usePortfolio();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const totalPortfolioValue = getTotalPortfolioValue();
  const totalStakedValue = stakedTokens.reduce((sum, token) => sum + (token.price * token.balance), 0);
  const stakedPercentage = totalPortfolioValue > 0 ? (totalStakedValue / totalPortfolioValue) * 100 : 0;
  
  // Estimate primary yield (from rental income)
  const primaryYield = 0.07; // 7% average
  const annualPrimaryYield = totalStakedValue * primaryYield;
  
  // Estimate secondary yield (from reinvested income)
  const secondaryYield = 0.12; // 12% average from reinvestment
  const annualSecondaryYield = annualPrimaryYield * secondaryYield;
  
  // Total combined yield
  const totalAnnualYield = annualPrimaryYield + annualSecondaryYield;
  const combinedYieldRate = totalStakedValue > 0 ? (totalAnnualYield / totalStakedValue) * 100 : 0;
  
  // Calculate breakdown of staked assets by category
  const categoryBreakdown = stakedTokens.reduce((acc, token) => {
    const category = token.category;
    const value = token.price * token.balance;
    
    if (!acc[category]) {
      acc[category] = { value: 0, percentage: 0 };
    }
    
    acc[category].value += value;
    return acc;
  }, {} as Record<string, { value: number, percentage: number }>);
  
  // Calculate percentages
  if (totalStakedValue > 0) {
    Object.keys(categoryBreakdown).forEach(category => {
      categoryBreakdown[category].percentage = (categoryBreakdown[category].value / totalStakedValue) * 100;
    });
  }
  
  // Sort categories by value (descending)
  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b.value - a.value)
    .map(([category, { percentage }]) => ({ 
      category, 
      percentage,
      color: getCategoryColor(category)
    }));
  
  // If there are fewer than 4 categories, add an "Other" category
  if (sortedCategories.length > 4) {
    const topCategories = sortedCategories.slice(0, 3);
    const otherPercentage = sortedCategories.slice(3).reduce((sum, item) => sum + item.percentage, 0);
    
    topCategories.push({
      category: "Other RWAs",
      percentage: otherPercentage,
      color: "purple-500"
    });
    
    sortedCategories.splice(0, sortedCategories.length, ...topCategories);
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
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
      
      <Card className={isDark ? "border-blue-900/50" : ""}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <ArrowUpRight size={18} className={isDark ? "text-green-400" : "text-green-600"} />
            <CardTitle className="text-lg">Primary Yield</CardTitle>
          </div>
          <CardDescription>
            Direct rental income from your assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold text-green-600 ${isDark ? "text-green-400" : ""}`}>
            ₹{annualPrimaryYield.toLocaleString('en-IN', {maximumFractionDigits: 2})}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Annual income at {(primaryYield * 100).toFixed(1)}% APY
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span>Monthly income:</span>
              <span className="font-medium">₹{(annualPrimaryYield / 12).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span>Quarterly income:</span>
              <span className="font-medium">₹{(annualPrimaryYield / 4).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className={isDark ? "border-blue-900/50" : ""}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className={isDark ? "text-purple-400" : "text-purple-600"} />
            <CardTitle className="text-lg">Compound Effect</CardTitle>
          </div>
          <CardDescription>
            Extra growth from Yield-on-Yield
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${isDark ? "text-purple-400" : "text-purple-600"}`}>
            ₹{totalAnnualYield.toLocaleString('en-IN', {maximumFractionDigits: 2})}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Combined yield at {combinedYieldRate.toFixed(1)}% effective APY
          </div>
          
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Primary yield:</span>
              <span className="font-medium text-green-600">₹{annualPrimaryYield.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Secondary yield:</span>
              <span className="font-medium text-amber-600">₹{annualSecondaryYield.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>
            
            <div className="mt-2 pt-2 border-t flex items-center gap-1 text-xs">
              <ArrowUpRight size={14} className="text-purple-500" />
              <span className="text-purple-600">
                {((secondaryYield / primaryYield) * 100).toFixed(0)}% boost with Yield-on-Yield strategy
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to assign colors based on category
function getCategoryColor(category: string): string {
  switch (category) {
    case "Real Estate":
      return "blue-500";
    case "Entertainment":
      return "green-500";
    case "Commodity":
      return "amber-500";
    case "Private Credit":
      return "red-500";
    case "Native Token":
      return "indigo-500";
    default:
      return "purple-500";
  }
}

export default StakingStats;
