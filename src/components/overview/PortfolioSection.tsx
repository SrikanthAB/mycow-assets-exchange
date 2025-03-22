
import React from "react";
import { usePortfolio } from "@/contexts/portfolio/usePortfolio";
import { Button } from "@/components/ui/button";
import PortfolioSummary from "./PortfolioSummary";
import AssetCard from "./AssetCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTheme } from "@/components/ui/theme-provider";

// Categories for filtering assets
const categories = [
  "All Assets",
  "Real Estate",
  "Commodity",
  "Entertainment",
  "Private Credit",
  "Stablecoin",
  "Native Token"
];

const PortfolioSection = () => {
  const { tokens, getTotalPortfolioValue } = usePortfolio();
  const totalValue = getTotalPortfolioValue();
  const [activeCategory, setActiveCategory] = React.useState("All Assets");
  const { theme } = useTheme();
  
  // Filter tokens by category
  const filteredTokens = activeCategory === "All Assets" 
    ? tokens 
    : tokens.filter(token => token.category === activeCategory);

  return (
    <div className="space-y-6">
      <PortfolioSummary totalValue={totalValue} />
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Assets</h2>
        <p className="text-muted-foreground">
          Manage your token holdings and track their performance
        </p>
        
        {tokens.length === 0 ? (
          <div className={`text-center py-12 ${theme === 'dark' ? 'bg-[#0f172a] border border-blue-900/30' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <p className="text-muted-foreground">You don't have any assets yet.</p>
            <Button className={`mt-4 ${theme === 'dark' ? 'bg-[#1e293b] border border-blue-900/30 hover:bg-[#0f172a] text-white' : ''}`}>
              Browse Markets
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="All Assets" className="animate-fade-in">
            <div className={`mb-8 border-b ${theme === 'dark' ? 'border-blue-900/30' : 'border-border'} overflow-x-auto pb-1`}>
              <TabsList className="bg-transparent h-auto p-0 space-x-6">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="px-1 py-2 text-base data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value={activeCategory} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTokens.map(token => (
                  <AssetCard key={token.id} token={token} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default PortfolioSection;
