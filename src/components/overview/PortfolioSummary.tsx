
import React from "react";
import { Button } from "@/components/ui/button";

interface PortfolioSummaryProps {
  totalValue: number;
}

const PortfolioSummary = ({ totalValue }: PortfolioSummaryProps) => {
  return (
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
  );
};

export default PortfolioSummary;
