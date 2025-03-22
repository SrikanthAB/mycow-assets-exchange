
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Token } from "@/contexts/portfolio";
import { usePortfolio } from "@/contexts/portfolio";

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
  
  const totalStakedValue = stakedTokens.reduce((sum, token) => sum + (token.price * token.balance), 0);
  const expectedReturn = selectedStrategy ? parseFloat(selectedStrategy.expectedReturn.split('-')[1]) / 100 : 0.09;
  
  // Calculate compound growth over time
  const calculateCompoundGrowth = (initialValue: number, rate: number, years: number) => {
    return initialValue * Math.pow(1 + rate, years);
  };
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Projected Growth with {selectedStrategy?.name || "Default"} Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {[1, 3, 5, 10].map((years) => {
              const projectedValue = calculateCompoundGrowth(
                totalStakedValue,
                expectedReturn,
                years
              );
              
              return (
                <Card key={years} className="overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-2 pt-4">
                    <CardTitle className="text-center text-sm">{years} Year{years > 1 ? 's' : ''}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-center text-2xl font-bold">
                      ₹{projectedValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      +{Math.round((projectedValue / totalStakedValue - 1) * 100)}% growth
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="text-muted-foreground">
              <strong>Note:</strong> Projections are based on the selected strategy's expected returns and assume
              consistent performance over time. Actual results may vary based on market conditions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectedGrowthCard;
