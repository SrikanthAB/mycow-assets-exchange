
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Calculator, ArrowRight, Info, ArrowUpRight } from "lucide-react";

const IBPLs = () => {
  const { tokens, getTotalPortfolioValue } = usePortfolio();
  const totalValue = getTotalPortfolioValue();
  const { toast } = useToast();
  
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [collateralRatio, setCollateralRatio] = useState<number>(150);
  const [selectedToken, setSelectedToken] = useState<string>(tokens[0]?.id || "");
  const [loanTerm, setLoanTerm] = useState<number>(30);
  
  const maxLoanAmount = totalValue * 0.66; // 66% of total portfolio value
  const requiredCollateral = (loanAmount * collateralRatio) / 100;
  const interestRate = 9.5 + (150 - collateralRatio) * 0.05; // Base rate of 9.5%, increases as collateral ratio decreases
  const monthlyPayment = loanAmount * (interestRate/100/12) / (1 - Math.pow(1 + interestRate/100/12, -loanTerm));
  
  const handleApplyForLoan = () => {
    if (loanAmount <= 0 || loanAmount > maxLoanAmount) return;
    
    toast({
      title: "Loan Application Submitted",
      description: `Your loan application for ₹${loanAmount.toLocaleString('en-IN')} has been submitted successfully. You will receive a confirmation shortly.`,
    });
  };
  
  const activeLoans = [
    {
      id: "loan1",
      amount: 50000,
      collateral: "Digital Gold (DGOLD)",
      collateralValue: 75000,
      collateralRatio: 150,
      interestRate: 9.5,
      term: 90,
      startDate: "2023-12-15",
      remainingDays: 45
    }
  ];
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <h2>Investment-Backed Loans</h2>
              <p className="mt-3 text-muted-foreground">
                Access liquidity through over-collateralized loans without triggering capital gains taxes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* New Loan Application */}
              <div className="bg-background rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-medium mb-6">Apply for a New Loan</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Available Collateral</label>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Portfolio Value</span>
                        <span className="font-medium">₹{totalValue.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Loan Available</span>
                        <span className="font-medium">₹{maxLoanAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Loan Amount</label>
                    <Input
                      type="number"
                      value={loanAmount || ""}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      placeholder="Enter loan amount"
                      min={0}
                      max={maxLoanAmount}
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>Min: ₹1,000</span>
                      <span>Max: ₹{maxLoanAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="block text-sm font-medium">Collateral Ratio</label>
                      <span className="text-sm">{collateralRatio}%</span>
                    </div>
                    <Slider
                      value={[collateralRatio]}
                      min={130}
                      max={200}
                      step={5}
                      onValueChange={(value) => setCollateralRatio(value[0])}
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>Higher Risk</span>
                      <span>Lower Risk</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Collateral Token</label>
                    <select 
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                    >
                      {tokens.map(token => (
                        <option key={token.id} value={token.id}>
                          {token.name} ({token.symbol}) - {token.balance.toFixed(2)} tokens
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="block text-sm font-medium">Loan Term (Days)</label>
                      <span className="text-sm">{loanTerm} days</span>
                    </div>
                    <Slider
                      value={[loanTerm]}
                      min={7}
                      max={365}
                      step={1}
                      onValueChange={(value) => setLoanTerm(value[0])}
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>7 days</span>
                      <span>365 days</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Required Collateral</span>
                      <span className="font-medium">₹{requiredCollateral.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interest Rate</span>
                      <span className="font-medium">{interestRate.toFixed(2)}%</span>
                    </div>
                    {loanTerm >= 30 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Est. Monthly Payment</span>
                        <span className="font-medium">₹{isNaN(monthlyPayment) ? "0" : monthlyPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    disabled={loanAmount <= 0 || loanAmount > maxLoanAmount}
                    onClick={handleApplyForLoan}
                  >
                    Apply for Loan
                  </Button>
                </div>
              </div>
              
              {/* Active Loans */}
              <div>
                <h3 className="text-xl font-medium mb-6">Active Loans</h3>
                
                {activeLoans.length === 0 ? (
                  <div className="bg-background rounded-xl shadow-sm p-6 text-center">
                    <p className="text-muted-foreground">You don't have any active loans.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeLoans.map(loan => (
                      <div key={loan.id} className="bg-background rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Badge variant="outline" className="mb-2">Active</Badge>
                            <h4 className="text-lg font-medium">₹{loan.amount.toLocaleString('en-IN')}</h4>
                            <p className="text-sm text-muted-foreground">{loan.remainingDays} days remaining</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Manage <ArrowRight className="ml-1 w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Collateral</p>
                            <p>{loan.collateral}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Collateral Value</p>
                            <p>₹{loan.collateralValue.toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Collateral Ratio</p>
                            <p>{loan.collateralRatio}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Interest Rate</p>
                            <p>{loan.interestRate}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-8 bg-muted/30 rounded-xl p-6">
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-primary/10 rounded-lg">
                      <Calculator className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Need help planning your loan?</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Our loan calculator can help you estimate payments and find the best terms for your situation.
                      </p>
                      <Button variant="link" className="px-0 py-1 h-auto text-primary">
                        Open Loan Calculator <ArrowUpRight className="ml-1 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default IBPLs;
