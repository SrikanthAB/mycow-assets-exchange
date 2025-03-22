
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Token } from "@/contexts/portfolio";
import { Sparkle } from "lucide-react";
import YieldStrategyDescription from "./components/YieldStrategyDescription";
import StakedAssetsTab from "./tabs/StakedAssetsTab";
import YieldStrategiesTab from "./tabs/YieldStrategiesTab";

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
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkle size={20} className="text-primary" />
        <h3 className="text-xl font-semibold">Yield on Yield Strategy</h3>
      </div>
      
      <YieldStrategyDescription />
      
      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="assets">Your Staked Assets</TabsTrigger>
          <TabsTrigger value="strategies">Yield Strategies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets" className="mt-0">
          <StakedAssetsTab 
            stakedTokens={stakedTokens}
            onManageToken={onManageToken}
          />
        </TabsContent>
        
        <TabsContent value="strategies" className="mt-0">
          <YieldStrategiesTab
            strategies={strategies}
            selectedStrategy={selectedStrategy}
            setSelectedStrategy={setSelectedStrategy}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YieldStrategiesSection;
