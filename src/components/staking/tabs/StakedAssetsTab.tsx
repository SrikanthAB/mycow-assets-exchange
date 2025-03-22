
import { Card } from "@/components/ui/card";
import StakedTokensCard from "../StakedTokensCard";
import { Token } from "@/contexts/portfolio";
import { useTheme } from "@/components/ui/theme-provider";

interface StakedAssetsTabProps {
  stakedTokens: Token[];
  onManageToken: (token: Token) => void;
}

const StakedAssetsTab = ({ stakedTokens, onManageToken }: StakedAssetsTabProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Generate randomized but consistent allocation percentages based on tokens
  const generateAllocations = () => {
    if (stakedTokens.length === 0) return [];
    
    // Use token categories to create allocations
    const categoryAllocations: Record<string, number> = {};
    let totalValue = 0;
    
    // Calculate the total value and value per category
    stakedTokens.forEach(token => {
      const value = token.price * token.balance;
      totalValue += value;
      
      if (!categoryAllocations[token.category]) {
        categoryAllocations[token.category] = 0;
      }
      categoryAllocations[token.category] += value;
    });
    
    // Convert to percentages and format for display
    return Object.entries(categoryAllocations)
      .map(([category, value]) => ({
        category,
        percentage: Math.round((value / totalValue) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3); // Limit to top 3 categories
  };
  
  const allocations = generateAllocations();
  
  // Get appropriate color for each category
  const getCategoryColor = (category: string) => {
    switch(category) {
      case "Private Credit": return "bg-primary";
      case "Entertainment": return "bg-amber-500";
      case "Real Estate": return "bg-green-500";
      case "Native Token": return "bg-indigo-500";
      default: return "bg-purple-500";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <StakedTokensCard 
          stakedTokens={stakedTokens} 
          onManageToken={onManageToken} 
        />
      </div>
      
      <div className="lg:col-span-4">
        <Card className="h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Yield Allocation</h3>
            
            {stakedTokens.length === 0 ? (
              <div className="text-muted-foreground text-sm">
                Start staking your tokens to see your yield allocation
              </div>
            ) : (
              <div className="space-y-6">
                {allocations.map((item, index) => (
                  <div key={item.category}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{item.category}</span>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-primary/10 rounded-full h-2">
                      <div className={`${getCategoryColor(item.category)} h-2 rounded-full`} 
                           style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
                
                <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                  Your yield is automatically redistributed according to your selected strategy
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StakedAssetsTab;
