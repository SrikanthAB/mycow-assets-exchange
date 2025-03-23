
import { useState } from "react";
import { Loan } from "../types";

export const useLoans = (
  addTransaction: (transaction: any) => void,
  lockToken: (id: string, amount: number, loanId: string) => void,
  unlockToken: (id: string) => void,
  addFunds: (amount: number) => void,
  deductFunds: (amount: number) => boolean,
  getTokenByLoanId: (loanId: string) => any
) => {
  // Initialize with an empty loans array instead of sample data
  const [loans, setLoans] = useState<Loan[]>([]);

  // Add a new loan
  const addLoan = (loan: Omit<Loan, 'id'>) => {
    const newLoan: Loan = {
      ...loan,
      id: Date.now().toString(),
    };
    
    setLoans(prev => [...prev, newLoan]);
    
    // Lock the collateral token
    lockToken(loan.collateralToken, loan.collateralAmount, newLoan.id);
    
    // Add funds to wallet
    addFunds(loan.amount);
    
    // Add loan transaction
    addTransaction({
      type: 'loan',
      asset: loan.collateralToken, // The token name will be resolved in the provider
      amount: loan.collateralAmount,
      value: loan.amount,
      status: 'completed'
    });
    
    // Add lock collateral transaction
    addTransaction({
      type: 'lock',
      asset: loan.collateralToken, // The token name will be resolved in the provider
      amount: loan.collateralAmount,
      value: loan.collateralValue,
      status: 'completed'
    });
  };

  // Repay a loan
  const repayLoan = (id: string) => {
    const loan = loans.find(loan => loan.id === id);
    
    if (!loan) return;
    
    // Deduct funds from wallet
    if (!deductFunds(loan.amount)) return;
    
    // Update loan status
    setLoans(prev => 
      prev.map(l => 
        l.id === id 
          ? { ...l, status: 'repaid' as const } 
          : l
      )
    );
    
    // Find and unlock the token
    const lockedToken = getTokenByLoanId(id);
    
    if (lockedToken) {
      unlockToken(lockedToken.id);
      
      // Add repayment transaction
      addTransaction({
        type: 'repayment',
        asset: lockedToken.name,
        amount: loan.amount,
        value: loan.amount,
        status: 'completed'
      });
      
      // Add unlock transaction
      addTransaction({
        type: 'unlock',
        asset: lockedToken.name,
        amount: lockedToken.lockedAmount || 0,
        value: (lockedToken.lockedAmount || 0) * lockedToken.price,
        status: 'completed'
      });
    }
  };

  return {
    loans,
    addLoan,
    repayLoan
  };
};
