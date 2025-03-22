
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import YieldStrategyCard from "@/components/YieldStrategyCard";
import StakedTokensCard from "./StakedTokensCard";
import { Token } from "@/contexts/portfolio";
import { TrendingUp, Sparkle, ArrowUpRight } from "lucide-react";

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
      
      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="assets">Your Staked Assets</TabsTrigger>
          <TabsTrigger value="strategies">Yield Strategies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets" className="mt-0">
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
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Private Credit</span>
                          <span className="font-medium">60%</span>
                        </div>
                        <div className="w-full bg-primary/10 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Entertainment Rights</span>
                          <span className="font-medium">30%</span>
                        </div>
                        <div className="w-full bg-primary/10 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Native Tokens</span>
                          <span className="font-medium">10%</span>
                        </div>
                        <div className="w-full bg-primary/10 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                        Your yield is automatically redistributed according to your selected strategy
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="strategies" className="mt-0">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YieldStrategiesSection;
