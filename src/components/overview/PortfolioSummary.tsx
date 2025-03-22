
import React from "react";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/contexts/portfolio/usePortfolio";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PortfolioSummaryProps {
  totalValue: number;
}

const PortfolioSummary = ({ totalValue }: PortfolioSummaryProps) => {
  const { getAvailablePortfolioValue } = usePortfolio();
  const availableValue = getAvailablePortfolioValue();
  
  return (
    <div className="bg-[#0f172a] border border-blue-900/30 rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <div className="space-y-3">
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">Total Portfolio Value</h3>
            <div className="text-3xl font-bold mt-1 text-white">₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          </div>
          
          {availableValue < totalValue && (
            <div>
              <div className="flex items-center">
                <h3 className="text-muted-foreground text-sm font-medium">Available Portfolio Value</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-56">This is the value of your portfolio excluding assets locked as collateral for loans</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-xl font-medium mt-1 text-amber-500">₹{availableValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
            </div>
          )}
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" className="bg-[#1e293b] border border-blue-900/30 hover:bg-[#0f172a] text-white">Export Report</Button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
