
import React, { useState, useEffect } from "react";
import { usePortfolio } from "@/contexts/portfolio/usePortfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/ui/theme-provider";
import AddFundsModal from "./AddFundsModal";

const WalletSection = () => {
  const { walletBalance, getTotalPortfolioValue, tokens } = usePortfolio();
  const totalValue = getTotalPortfolioValue();
  const { theme } = useTheme();
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(walletBalance);

  // Update current balance when wallet balance changes
  useEffect(() => {
    console.log("Wallet balance updated in WalletSection:", walletBalance);
    setCurrentBalance(walletBalance);
  }, [walletBalance]);

  return (
    <>
      <Card className={theme === 'dark' ? 'bg-[#0f172a] border border-blue-900/30' : ''}>
        <CardHeader>
          <CardTitle>Your Wallet</CardTitle>
          <CardDescription>
            Manage your funds and add money to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className={`${theme === 'dark' ? 'bg-[#1e293b] border border-blue-900/30' : 'bg-muted/30'} rounded-xl p-6`}>
              <h3 className="text-muted-foreground text-sm font-medium">Available Balance</h3>
              <div className="text-3xl font-bold mt-1">₹{currentBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className={`flex-1 ${theme === 'dark' ? 'bg-[#1e293b] border border-blue-900/30 hover:bg-[#0f172a] text-white' : ''}`}
                onClick={() => setIsAddFundsModalOpen(true)}
              >
                Add Funds
              </Button>
              <Button 
                variant="outline" 
                className={`flex-1 ${theme === 'dark' ? 'bg-[#1e293b] border border-blue-900/30 hover:bg-[#0f172a] text-white' : ''}`}
              >
                Withdraw
              </Button>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-[#1e293b] border border-blue-900/30' : 'bg-muted/30'} rounded-xl p-6`}>
              <h3 className="font-medium mb-4">Quick Stats</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-muted-foreground text-sm">Total Portfolio</div>
                  <div className="font-medium">₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Total Assets</div>
                  <div className="font-medium">{tokens.length}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddFundsModal 
        isOpen={isAddFundsModalOpen} 
        onClose={() => setIsAddFundsModalOpen(false)} 
      />
    </>
  );
};

export default WalletSection;
