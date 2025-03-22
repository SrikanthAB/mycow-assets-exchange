
import { useState } from "react";
import { Token, Loan } from "@/contexts/portfolio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Calculator, ArrowUpRight } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

interface ActiveLoansProps {
  loans: Loan[];
  tokens: Token[];
  onRepayLoan: (loanId: string) => void;
}

const ActiveLoans = ({ loans, tokens, onRepayLoan }: ActiveLoansProps) => {
  const { theme } = useTheme();
  const activeLoans = loans.filter(loan => loan.status === 'active');
  
  return (
    <div>
      <h3 className="text-xl font-medium mb-6">Active Loans</h3>
      
      {activeLoans.length === 0 ? (
        <div className={`${theme === 'dark' ? 'bg-[#0f172a] border border-blue-900/30' : 'bg-white border'} rounded-xl shadow-sm p-6 text-center`}>
          <p className="text-muted-foreground">You don't have any active loans.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeLoans.map(loan => (
            <div key={loan.id} className={`${theme === 'dark' ? 'bg-[#0f172a] border border-blue-900/30' : 'bg-white border'} rounded-xl shadow-sm p-6`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Badge variant="outline" className="mb-2">Active</Badge>
                  <h4 className="text-lg font-medium">₹{loan.amount.toLocaleString('en-IN')}</h4>
                  <p className="text-sm text-muted-foreground">{loan.remainingDays} days remaining</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${theme === 'dark' ? 'bg-[#1e293b] border border-blue-900/30 hover:bg-[#0f172a] text-white' : ''}`}
                  onClick={() => onRepayLoan(loan.id)}
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
      
      <div className={`mt-8 ${theme === 'dark' ? 'bg-[#1e293b] border border-blue-900/30' : 'bg-white border border-gray-200'} rounded-xl p-6`}>
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
  );
};

export default ActiveLoans;
