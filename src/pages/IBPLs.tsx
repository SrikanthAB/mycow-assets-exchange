
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePortfolio } from "@/contexts/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Calculator, ArrowRight, Info, ArrowUpRight, Lock, AlertTriangle } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { FormEvent } from "react";

const IBPLs = () => {
  
  const { tokens, getTotalPortfolioValue, getAvailablePortfolioValue, addLoan, repayLoan, loans, walletBalance } = usePortfolio();
  const availablePortfolioValue = getAvailablePortfolioValue(); // Only use available value
  const { toast } = useToast();
  
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [collateralRatio, setCollateralRatio] = useState<number>(150);
  const [selectedToken, setSelectedToken] = useState<string>(tokens.filter(t => !t.locked)[0]?.id || "");
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [repayDialogOpen, setRepayDialogOpen] = useState<boolean>(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string>("");
  
  // Max loan amount should be 66% of available portfolio value
  const maxLoanAmount = availablePortfolioValue * 0.66;
  const requiredCollateral = (loanAmount * collateralRatio) / 100;
  const interestRate = 9.5 + (150 - collateralRatio) * 0.05; // Base rate of 9.5%, increases as collateral ratio decreases
  const monthlyPayment = loanAmount * (interestRate/100/12) / (1 - Math.pow(1 + interestRate/100/12, -loanTerm));
  
  // Get only unlocked tokens for selection
  const availableTokens = tokens.filter(t => !t.locked);
  
  // Get the selected token object
  const selectedTokenObj = tokens.find(t => t.id === selectedToken);
  const selectedTokenValue = selectedTokenObj ? selectedTokenObj.price * selectedTokenObj.balance : 0;
  const hasEnoughCollateral = selectedTokenValue >= requiredCollateral;
  
  // Calculate repayment amount for a loan (principal only for simplicity)
  const getRepaymentAmount = (loanId: string) => {
    const loan = loans.find(loan => loan.id === loanId);
    return loan ? loan.amount : 0;
  };
  
  const handleRepayLoan = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedLoanId) return;
    
    const repaymentAmount = getRepaymentAmount(selectedLoanId);
    
    if (walletBalance < repaymentAmount) {
      toast({
        title: "Insufficient Balance",
        description: `You need ₹${repaymentAmount.toLocaleString('en-IN')} to repay this loan. Your wallet balance is ₹${walletBalance.toLocaleString('en-IN')}.`,
        variant: "destructive"
      });
      return;
    }
    
    repayLoan(selectedLoanId);
    
    toast({
      title: "Loan Repaid Successfully",
      description: `Your loan has been repaid and the collateral has been unlocked.`,
    });
    
    setRepayDialogOpen(false);
  };
  
  const handleApplyForLoan = () => {
    if (loanAmount <= 0 || loanAmount > maxLoanAmount) return;
    if (!hasEnoughCollateral) return;
    if (!selectedTokenObj) return;
    
    // Calculate the amount of token needed for collateral
    const collateralAmount = requiredCollateral / selectedTokenObj.price;
    
    // Apply for loan
    addLoan({
      amount: loanAmount,
      collateralToken: selectedTokenObj.id,
      collateralAmount: collateralAmount,
      collateralValue: requiredCollateral,
      collateralRatio: collateralRatio,
      interestRate: interestRate,
      term: loanTerm,
      startDate: new Date().toISOString(),
      remainingDays: loanTerm,
      status: 'active'
    });
    
    toast({
      title: "Loan Application Approved",
      description: `Your loan for ₹${loanAmount.toLocaleString('en-IN')} has been approved. The funds have been added to your wallet.`,
    });
    
    // Reset form
    setLoanAmount(0);
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <h2 className="text-2xl font-bold">Investment-Backed Loans</h2>
              <p className="mt-3 text-muted-foreground">
                Access liquidity through over-collateralized loans without triggering capital gains taxes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* New Loan Application */}
              <div className="bg-[#0f172a] border border-blue-900/30 rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-medium mb-6 text-white">Apply for a New Loan</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Available Collateral</label>
                    <div className="bg-[#1e293b] border border-blue-900/30 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Available Portfolio Value</span>
                        <span className="font-medium text-white">₹{availablePortfolioValue.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Loan Available</span>
                        <span className="font-medium text-white">₹{maxLoanAmount.toLocaleString('en-IN')}</span>
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
                    {availableTokens.length > 0 ? (
                      <select 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                        value={selectedToken}
                        onChange={(e) => setSelectedToken(e.target.value)}
                      >
                        {availableTokens.map(token => (
                          <option key={token.id} value={token.id}>
                            {token.name} ({token.symbol}) - {token.balance.toFixed(2)} tokens
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
                        <p className="flex items-center">
                          <AlertTriangle size={16} className="mr-2" />
                          No available tokens to use as collateral
                        </p>
                      </div>
                    )}
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
                    {selectedTokenObj && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available Token Value</span>
                        <span className={`font-medium ${hasEnoughCollateral ? 'text-green-600' : 'text-red-500'}`}>
                          ₹{selectedTokenValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                        </span>
                      </div>
                    )}
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
                  
                  {!hasEnoughCollateral && loanAmount > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm text-red-600 dark:text-red-400 flex items-start">
                      <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        The selected token doesn't have enough value to meet the collateral requirements. 
                        Please select a different token or reduce the loan amount.
                      </span>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full mt-4 bg-[#1e293b] border border-blue-900/30 hover:bg-[#0f172a] text-white" 
                    disabled={loanAmount <= 0 || loanAmount > maxLoanAmount || !hasEnoughCollateral || availableTokens.length === 0}
                    onClick={handleApplyForLoan}
                  >
                    Apply for Loan
                  </Button>
                </div>
              </div>
              
              {/* Active Loans */}
              <div>
                <h3 className="text-xl font-medium mb-6 text-white">Active Loans</h3>
                
                {loans.filter(loan => loan.status === 'active').length === 0 ? (
                  <div className="bg-[#0f172a] border border-blue-900/30 rounded-xl shadow-sm p-6 text-center">
                    <p className="text-muted-foreground">You don't have any active loans.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loans.filter(loan => loan.status === 'active').map(loan => (
                      <div key={loan.id} className="bg-[#0f172a] border border-blue-900/30 rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Badge variant="outline" className="mb-2">Active</Badge>
                            <h4 className="text-lg font-medium text-white">₹{loan.amount.toLocaleString('en-IN')}</h4>
                            <p className="text-sm text-muted-foreground">{loan.remainingDays} days remaining</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-[#1e293b] border border-blue-900/30 hover:bg-[#0f172a] text-white"
                            onClick={() => {
                              setSelectedLoanId(loan.id);
                              setRepayDialogOpen(true);
                            }}
                          >
                            Repay Loan <ArrowRight className="ml-1 w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Collateral</p>
                            <div className="flex items-center">
                              <p>
                                {tokens.find(t => t.id === loan.collateralToken)?.name || loan.collateralToken}
                              </p>
                              <Lock size={14} className="ml-2 text-amber-500" />
                            </div>
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
                
                <div className="mt-8 bg-[#1e293b] border border-blue-900/30 rounded-xl p-6">
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-primary/10 rounded-lg">
                      <Calculator className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Need help planning your loan?</h4>
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
      
      <Dialog open={repayDialogOpen} onOpenChange={setRepayDialogOpen}>
        <DialogContent className="bg-[#0f172a] border border-blue-900/30 text-white">
          <DialogHeader>
            <DialogTitle>Repay Loan</DialogTitle>
            <DialogDescription>
              Are you sure you want to repay this loan? The full amount will be deducted from your wallet balance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Repayment Amount</span>
              <span className="font-medium text-white">₹{getRepaymentAmount(selectedLoanId).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Your Wallet Balance</span>
              <span className="font-medium text-white">₹{walletBalance.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" className="bg-[#1e293b] border border-blue-900/30 hover:bg-[#0f172a] text-white" onClick={() => setRepayDialogOpen(false)}>Cancel</Button>
            <Button className="bg-[#1e293b] border border-blue-900/30 hover:bg-[#0f172a] text-white" onClick={handleRepayLoan}>Repay Loan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default IBPLs;
