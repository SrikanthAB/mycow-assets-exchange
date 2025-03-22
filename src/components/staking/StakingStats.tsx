
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePortfolio } from "@/contexts/portfolio";

const StakingStats = () => {
  const { tokens, getTotalPortfolioValue } = usePortfolio();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <Card>
        <CardHeader>
          <CardTitle>Current Holdings</CardTitle>
          <CardDescription>
            Your portfolio of RWA tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ₹{getTotalPortfolioValue().toLocaleString('en-IN', {maximumFractionDigits: 2})}
          </div>
          <div className="text-sm text-muted-foreground">
            Total value across {tokens.length} tokens
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Estimated Yield</CardTitle>
          <CardDescription>
            Based on your current holdings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            ₹{(getTotalPortfolioValue() * 0.092).toLocaleString('en-IN', {maximumFractionDigits: 2})}
          </div>
          <div className="text-sm text-muted-foreground">
            Annual yield at average 9.2% APY
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Compound Growth</CardTitle>
          <CardDescription>
            With yield reinvestment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            ₹{(getTotalPortfolioValue() * 1.57).toLocaleString('en-IN', {maximumFractionDigits: 2})}
          </div>
          <div className="text-sm text-muted-foreground">
            Projected value after 5 years
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakingStats;
