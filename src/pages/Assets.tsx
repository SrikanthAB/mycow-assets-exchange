
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Assets = () => {
  const { tokens, getTotalPortfolioValue } = usePortfolio();
  const totalValue = getTotalPortfolioValue();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <h2>My Portfolio</h2>
              <p className="mt-3 text-muted-foreground">
                Manage your tokenized real-world assets and track their performance.
              </p>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between">
                <div>
                  <h3 className="text-muted-foreground text-sm font-medium">Total Portfolio Value</h3>
                  <div className="text-3xl font-bold mt-1">₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button variant="outline">Export Report</Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Your Assets</h3>
              
              {tokens.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">You don't have any assets yet.</p>
                  <Button className="mt-4">Browse Markets</Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {tokens.map(token => {
                    const isPositiveChange = token.change >= 0;
                    const tokenValue = token.price * token.balance;
                    
                    return (
                      <div key={token.id} className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center overflow-hidden">
                              {token.image ? (
                                <img src={token.image} alt={token.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                                  {token.symbol.substring(0, 2)}
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <h4 className="font-medium">{token.name}</h4>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <span className="bg-secondary px-1.5 py-0.5 rounded text-xs mr-2">{token.category}</span>
                                <span>{token.symbol}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-medium">Balance</div>
                            <div>{token.balance.toLocaleString('en-IN', { maximumFractionDigits: 4 })} {token.symbol}</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Current Value</div>
                            <div className="text-xl font-semibold">₹{tokenValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                            <div 
                              className={cn(
                                "flex items-center text-sm",
                                isPositiveChange ? "text-green-600" : "text-red-500"
                              )}
                            >
                              {isPositiveChange ? (
                                <TrendingUp size={14} className="mr-1" />
                              ) : (
                                <TrendingDown size={14} className="mr-1" />
                              )}
                              {isPositiveChange ? "+" : ""}{token.change}%
                            </div>
                          </div>
                          
                          {token.yield && (
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Estimated Yield</div>
                              <div className="font-medium text-green-600">{token.yield}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Assets;
