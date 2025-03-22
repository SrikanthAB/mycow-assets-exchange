
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Token } from "@/contexts/portfolio";
import { usePortfolio } from "@/contexts/portfolio";
import { useTheme } from "@/components/ui/theme-provider";
import { TrendingUp, ArrowUpRight } from "lucide-react";

interface YieldStrategy {
  id: string;
  name: string;
  description: string;
  expectedReturn: string;
  assets: string[];
  risk: string;
}

interface ProjectedGrowthCardProps {
  stakedTokens: Token[];
  selectedStrategy: YieldStrategy | undefined;
}

const ProjectedGrowthCard = ({ stakedTokens, selectedStrategy }: ProjectedGrowthCardProps) => {
  const { getTotalPortfolioValue } = usePortfolio();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const totalStakedValue = stakedTokens.reduce((sum, token) => sum + (token.price * token.balance), 0);
  const primaryYield = 0.07; // Base yield from rental income, approximately 7%
  const secondaryYield = selectedStrategy ? parseFloat(selectedStrategy.expectedReturn.split('-')[1]) / 100 : 0.09;
  
  // Calculate compound growth with primary and secondary yields
  const calculateCompoundGrowth = (initialValue: number, years: number) => {
    let value = initialValue;
    let primaryYieldAmount, secondaryYieldAmount;
    
    for (let i = 0; i < years; i++) {
      // Calculate primary yield
      primaryYieldAmount = value * primaryYield;
      
      // Primary yield gets reinvested at the secondary yield rate
      secondaryYieldAmount = primaryYieldAmount * secondaryYield;
      
      // Add both primary and secondary yields
      value = value + primaryYieldAmount + secondaryYieldAmount;
    }
    
    return value;
  };
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className={isDark ? "text-blue-400" : "text-primary"} />
          <CardTitle>Yield on Yield - Projected Growth</CardTitle>
        </div>
        <CardDescription>
          See how your yields can compound with the {selectedStrategy?.name || "Default"} Strategy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {[1, 3, 5, 10].map((years) => {
              const projectedValueWithYieldOnYield = calculateCompoundGrowth(
                totalStakedValue,
                years
              );
              
              // Calculate the standard value with just the primary yield for comparison
              const standardValue = totalStakedValue * Math.pow(1 + primaryYield, years);
              
              const yieldBoost = projectedValueWithYieldOnYield - standardValue;
              const boostPercentage = (yieldBoost / standardValue) * 100;
              
              return (
                <Card key={years} className={`overflow-hidden ${
                  isDark ? "border-blue-800/50" : "border-primary/20"
                }`}>
                  <CardHeader className={`${
                    isDark ? "bg-blue-950/30" : "bg-primary/5"
                  } pb-2 pt-4`}>
                    <CardTitle className="text-center text-sm">{years} Year{years > 1 ? 's' : ''}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className={`text-center text-2xl font-bold ${
                      isDark ? "text-white" : ""
                    }`}>
                      ₹{projectedValueWithYieldOnYield.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                    </div>
                    
                    {totalStakedValue > 0 && (
                      <>
                        <div className="text-center text-sm text-muted-foreground">
                          +{Math.round((projectedValueWithYieldOnYield / totalStakedValue - 1) * 100)}% total growth
                        </div>
                        
                        <div className="mt-2 pt-2 border-t flex items-center justify-center gap-1">
                          <ArrowUpRight size={14} className="text-green-500" />
                          <span className="text-xs text-green-500">
                            +{boostPercentage.toFixed(1)}% with Yield-on-Yield
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className={`p-4 rounded-lg text-sm ${
            isDark ? "bg-blue-950/30 border border-blue-900/30" : "bg-muted"
          }`}>
            <h4 className="font-medium mb-2">Understanding Yield on Yield</h4>
            <p className={isDark ? "text-blue-300/80" : "text-muted-foreground"}>
              Projections above demonstrate the power of the Yield-on-Yield strategy, where your primary rental income
              (typically 5-9% annually) is automatically reinvested into {selectedStrategy?.name.toLowerCase() || "balanced"} 
              risk assets that potentially yield {selectedStrategy?.expectedReturn || "8-15%"}. This creates a 
              compounding effect that can significantly enhance your overall returns compared to simply collecting rental income.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectedGrowthCard;
