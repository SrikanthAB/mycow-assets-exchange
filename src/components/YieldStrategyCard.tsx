
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gem, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface YieldStrategy {
  id: string;
  name: string;
  description: string;
  expectedReturn: string;
  assets: string[];
  risk: string;
}

interface YieldStrategyCardProps {
  strategies: YieldStrategy[];
  selectedStrategy: string;
  setSelectedStrategy: (strategy: string) => void;
}

const YieldStrategyCard: React.FC<YieldStrategyCardProps> = ({
  strategies,
  selectedStrategy,
  setSelectedStrategy,
}) => {
  const { toast } = useToast();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-green-500/10 text-green-600 border-green-200";
      case "Medium": return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "High": return "bg-red-500/10 text-red-600 border-red-200";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const handleApplyStrategy = () => {
    const strategy = strategies.find((s) => s.id === selectedStrategy);
    if (strategy) {
      toast({
        title: "Strategy Updated",
        description: `Your yield reinvestment strategy has been updated to ${strategy.name}.`,
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gem size={18} className="text-primary" />
          Yield Strategy
        </CardTitle>
        <CardDescription>
          Choose how to reinvest your yield returns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {strategies.map((strategy) => {
            const isSelected = selectedStrategy === strategy.id;
            return (
              <div
                key={strategy.id}
                className={`p-4 rounded-lg cursor-pointer transition-all border ${
                  isSelected 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                }`}
                onClick={() => setSelectedStrategy(strategy.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {isSelected && <CheckCircle size={16} className="text-primary" />}
                    <h4 className="font-medium text-base">{strategy.name}</h4>
                  </div>
                  <Badge className={`${getRiskColor(strategy.risk)}`}>
                    {strategy.risk} Risk
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {strategy.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">
                      {strategy.expectedReturn}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Assets: </span>
                    {strategy.assets.slice(0, 2).join(", ")}
                    {strategy.assets.length > 2 && "..."}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <Button 
            className="w-full gap-2" 
            onClick={handleApplyStrategy}
          >
            Apply Strategy
            <ArrowRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default YieldStrategyCard;
