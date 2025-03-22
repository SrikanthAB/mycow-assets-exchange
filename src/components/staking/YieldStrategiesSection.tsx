
import { Card } from "@/components/ui/card";
import YieldStrategyCard from "@/components/YieldStrategyCard";
import StakedTokensCard from "./StakedTokensCard";
import { Token } from "@/contexts/portfolio";

interface YieldStrategy {
  id: string;
  name: string;
  description: string;
  expectedReturn: string;
  assets: string[];
  risk: string;
}

interface YieldStrategiesSectionProps {
  strategies: YieldStrategy[];
  selectedStrategy: string;
  setSelectedStrategy: (strategy: string) => void;
  stakedTokens: Token[];
  onManageToken: (token: Token) => void;
}

const YieldStrategiesSection = ({
  strategies,
  selectedStrategy,
  setSelectedStrategy,
  stakedTokens,
  onManageToken
}: YieldStrategiesSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
      <div className="lg:col-span-8">
        <StakedTokensCard 
          stakedTokens={stakedTokens} 
          onManageToken={onManageToken} 
        />
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

export default YieldStrategiesSection;
