
import { Card } from "@/components/ui/card";
import YieldStrategyCard from "@/components/YieldStrategyCard";
import { Info } from "lucide-react";

interface YieldStrategy {
  id: string;
  name: string;
  description: string;
  expectedReturn: string;
  assets: string[];
  risk: string;
}

interface YieldStrategiesTabProps {
  strategies: YieldStrategy[];
  selectedStrategy: string;
  setSelectedStrategy: (strategy: string) => void;
}

const YieldStrategiesTab = ({
  strategies,
  selectedStrategy,
  setSelectedStrategy,
}: YieldStrategiesTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <Card 
              key={strategy.id}
              className={`cursor-pointer transition-all ${
                selectedStrategy === strategy.id 
                  ? "border-primary/50 bg-primary/5" 
                  : "hover:border-primary/30 hover:bg-muted/50"
              }`}
              onClick={() => setSelectedStrategy(strategy.id)}
            >
              <div className="p-6">
                <h4 className="font-medium mb-2 flex items-center justify-between">
                  {strategy.name}
                  {selectedStrategy === strategy.id && (
                    <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">Active</span>
                  )}
                </h4>
                
                <div className="text-sm text-muted-foreground mb-4">
                  {strategy.description}
                </div>
                
                <div className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Expected Return:</span>
                    <span className="font-medium text-primary">{strategy.expectedReturn}</span>
                  </div>
                  
                  <div className="flex justify-between mb-1">
                    <span>Risk Level:</span>
                    <span className={
                      strategy.risk === "Low" ? "text-green-600" : 
                      strategy.risk === "Medium" ? "text-amber-600" : 
                      "text-red-600"
                    }>{strategy.risk}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Assets:</span>
                    <span>{strategy.assets.join(", ")}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 border rounded-lg bg-muted/30">
          <h4 className="font-medium mb-2">Understanding Risk Profiles</h4>
          <p className="text-sm text-muted-foreground">
            Different strategies employ varying risk tranches to balance potential returns. 
            Conservative approaches focus on senior debt tranches with stable returns, 
            while growth strategies include junior tranches and variable income sources for higher potential yields.
          </p>
        </div>
      </div>
      
      <div className="lg:col-span-4">
        <YieldStrategyCard 
          strategies={strategies}
          selectedStrategy={selectedStrategy}
          setSelectedStrategy={setSelectedStrategy}
        />
      </div>
    </div>
  );
};

export default YieldStrategiesTab;
