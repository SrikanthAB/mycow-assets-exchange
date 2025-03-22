
import { useState } from "react";
import { Token } from "@/contexts/portfolio";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useToast } from "@/components/ui/use-toast";

interface LoanApplicationProps {
  tokens: Token[];
  availablePortfolioValue: number;
  maxLoanAmount: number;
  addLoan: Function;
}

const LoanApplication = ({ 
  tokens, 
  availablePortfolioValue, 
  maxLoanAmount,
  addLoan 
}: LoanApplicationProps) => {
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [collateralRatio, setCollateralRatio] = useState<number>(150);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<number>(30);
  
  // Set initial token if available and not already set
  if (selectedToken === "" && tokens.filter(t => !t.locked).length > 0) {
    setSelectedToken(tokens.filter(t => !t.locked)[0]?.id || "");
  }
  
  // Get only unlocked tokens for selection
  const availableTokens = tokens.filter(t => !t.locked);
  
  // Get the selected token object
  const selectedTokenObj = tokens.find(t => t.id === selectedToken);
  const selectedTokenValue = selectedTokenObj ? selectedTokenObj.price * selectedTokenObj.balance : 0;
  
  // Calculate loan details
  const requiredCollateral = (loanAmount * collateralRatio) / 100;
  const hasEnoughCollateral = selectedTokenValue >= requiredCollateral;
  const interestRate = 9.5 + (150 - collateralRatio) * 0.05; // Base rate of 9.5%, increases as collateral ratio decreases
  
  // Add defensive coding for monthlyPayment calculation
  let monthlyPayment = 0;
  if (loanAmount > 0 && interestRate > 0 && loanTerm > 0) {
    try {
      monthlyPayment = loanAmount * (interestRate/100/12) / (1 - Math.pow(1 + interestRate/100/12, -loanTerm));
      // Check for NaN or Infinity
      if (isNaN(monthlyPayment) || !isFinite(monthlyPayment)) {
        monthlyPayment = 0;
      }
    } catch (error) {
      console.error("Error calculating monthly payment:", error);
      monthlyPayment = 0;
    }
  }
  
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
    <div className={`${theme === 'dark' ? 'bg-[#0f172a] border border-blue-900/30' : 'bg-white border'} rounded-xl shadow-sm p-6`}>
      <h3 className="text-xl font-medium mb-6">Apply for a New Loan</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Available Collateral</label>
          <div className={`${theme === 'dark' ? 'bg-[#1e293b] border border-blue-900/30' : 'bg-gray-50 border'} p-4 rounded-lg`}>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Available Portfolio Value</span>
              <span className="font-medium">₹{availablePortfolioValue.toLocaleString('en-IN')}</span>
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
        
        <div className={`${theme === 'dark' ? 'bg-muted/30' : 'bg-gray-50'} p-4 rounded-lg space-y-2`}>
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
              <span className="font-medium">₹{monthlyPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
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
          className={`w-full mt-4 ${theme === 'dark' ? 'bg-[#1e293b] border border-blue-900/30 hover:bg-[#0f172a] text-white' : ''}`}
          disabled={loanAmount <= 0 || loanAmount > maxLoanAmount || !hasEnoughCollateral || availableTokens.length === 0}
          onClick={handleApplyForLoan}
        >
          Apply for Loan
        </Button>
      </div>
    </div>
  );
};

export default LoanApplication;
