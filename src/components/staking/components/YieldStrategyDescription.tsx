
import { TrendingUp, Sparkle, ArrowUpRight } from "lucide-react";

const YieldStrategyDescription = () => {
  return (
    <div className="p-6 rounded-lg border bg-primary/5 mb-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <TrendingUp size={24} />
        </div>
        <div>
          <h4 className="text-lg font-medium mb-2">Maximize Returns with Yield on Yield</h4>
          <p className="text-muted-foreground">
            Automatically reinvest your rental income from RWA tokens into other high-performing assets on the platform. 
            Create a compounding effect by deploying your primary yields into secondary investment opportunities.
          </p>
          
          <div className="mt-4 flex items-center text-sm text-primary">
            <ArrowUpRight size={16} className="mr-1" />
            <span>Potential to increase overall portfolio returns by 15-40% annually</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldStrategyDescription;
