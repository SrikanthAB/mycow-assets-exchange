
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowUpRight, ChevronRight, Gem, Info } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import StakeTokenModal from "@/components/StakeTokenModal";

const yieldStrategies = [
  {
    id: "conservative",
    name: "Conservative",
    description: "Low-risk investments with stable returns",
    expectedReturn: "5-7% APY",
    assets: ["Residential REIT", "Gold", "Stablecoins"],
    risk: "Low"
  },
  {
    id: "balanced",
    name: "Balanced",
    description: "Medium-risk investments with moderate returns",
    expectedReturn: "8-12% APY",
    assets: ["Commercial REIT", "Private Credit", "MyCow Token"],
    risk: "Medium"
  },
  {
    id: "aggressive",
    name: "Aggressive",
    description: "Higher-risk investments with potential for higher returns",
    expectedReturn: "13-20% APY",
    assets: ["Entertainment Funds", "Development REIT", "Startup Equity"],
    risk: "High"
  }
];

const Staking = () => {
  const { tokens, getTotalPortfolioValue } = usePortfolio();
  const [selectedStrategy, setSelectedStrategy] = useState("balanced");
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const { toast } = useToast();
  
  const stakedTokens = tokens.filter(token => token.balance > 0);
  
  const handleStake = (token: any) => {
    setSelectedToken(token);
    setIsStakeModalOpen(true);
  };
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-green-500/10 text-green-600";
      case "Medium": return "bg-amber-500/10 text-amber-600";
      case "High": return "bg-red-500/10 text-red-600";
      default: return "bg-primary/10 text-primary";
    }
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
              <div>
                <h2>Yield Management</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  Optimize returns on your tokenized RWAs by reinvesting yields into strategic allocations.
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button variant="outline" className="flex items-center gap-2">
                  <Info size={16} />
                  Learn About Yields
                </Button>
              </div>
            </div>
            
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
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              <div className="lg:col-span-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Staked Tokens</CardTitle>
                    <CardDescription>
                      Tokens generating yield in your portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stakedTokens.length > 0 ? (
                      <div className="space-y-4">
                        {stakedTokens.map(token => (
                          <div key={token.id} className="flex items-center justify-between p-4 bg-card border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                {token.symbol.substring(0, 2)}
                              </div>
                              <div>
                                <h4 className="font-medium">{token.name}</h4>
                                <div className="flex items-center text-sm">
                                  <Badge variant="secondary" className="mr-2">{token.category}</Badge>
                                  <span className="text-muted-foreground">{token.symbol}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-medium">{token.balance} tokens</div>
                              <div className="text-sm text-green-600">{token.yield}</div>
                            </div>
                            
                            <Button size="sm" variant="outline" onClick={() => handleStake(token)}>
                              Manage
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You have no staked tokens yet.</p>
                        <Button className="mt-4">Buy Tokens</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Yield Strategy</CardTitle>
                    <CardDescription>
                      Choose how to reinvest your yield
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ToggleGroup 
                      type="single" 
                      className="flex flex-col gap-3 w-full" 
                      value={selectedStrategy}
                      onValueChange={(value) => {
                        if (value) setSelectedStrategy(value);
                      }}
                    >
                      {yieldStrategies.map((strategy) => (
                        <ToggleGroupItem 
                          key={strategy.id} 
                          value={strategy.id}
                          className="w-full p-4 justify-start border data-[state=on]:border-primary data-[state=on]:bg-primary/5 rounded-lg"
                        >
                          <div className="flex flex-col items-start">
                            <div className="flex justify-between w-full">
                              <span className="font-medium">{strategy.name}</span>
                              <Badge className={getRiskColor(strategy.risk)}>
                                {strategy.risk} Risk
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{strategy.description}</p>
                            <div className="mt-2 text-sm flex items-center gap-2">
                              <Gem size={14} className="text-primary" />
                              <span className="text-primary">{strategy.expectedReturn}</span>
                            </div>
                          </div>
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                    
                    <Button className="w-full mt-6" onClick={() => {
                      toast({
                        title: "Strategy Updated",
                        description: `Your yield reinvestment strategy has been updated to ${
                          yieldStrategies.find(s => s.id === selectedStrategy)?.name
                        }.`,
                      });
                    }}>
                      Apply Strategy
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Projected Growth with Yield Reinvestment</CardTitle>
                <CardDescription>
                  See how your investments can grow over time with compound returns
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Growth Chart Coming Soon</p>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Projections based on historical performance
                </div>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  See Detailed Analytics
                  <ChevronRight size={14} />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      
      {selectedToken && (
        <StakeTokenModal
          isOpen={isStakeModalOpen}
          onClose={() => setIsStakeModalOpen(false)}
          token={selectedToken}
          strategy={yieldStrategies.find(s => s.id === selectedStrategy)!}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Staking;
