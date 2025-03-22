
import React from "react";
import { usePortfolio } from "@/contexts/portfolio";
import { Button } from "@/components/ui/button";
import PortfolioSummary from "./PortfolioSummary";
import AssetCard from "./AssetCard";

const PortfolioSection = () => {
  const { tokens, getTotalPortfolioValue } = usePortfolio();
  const totalValue = getTotalPortfolioValue();

  return (
    <div className="space-y-6">
      <PortfolioSummary totalValue={totalValue} />
      
      <div className="space-y-4">
        <h3 className="text-xl font-medium">Your Assets</h3>
        
        {tokens.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">You don't have any assets yet.</p>
            <Button className="mt-4">Browse Markets</Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {tokens.map(token => (
              <AssetCard key={token.id} token={token} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioSection;
