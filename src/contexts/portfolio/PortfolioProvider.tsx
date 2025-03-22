
import React, { createContext, ReactNode } from "react";
import { PortfolioContextType } from "./types";
import { useTransactions, useTokens, useWallet, useLoans } from "./hooks";

export const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  // Initialize hooks for different parts of the portfolio functionality
  const { transactions, isLoading, addTransaction } = useTransactions();
  const { 
    tokens, 
    addToken, 
    removeToken, 
    updateTokenBalance, 
    lockToken, 
    unlockToken,
    getTokenByLoanId,
    getTotalPortfolioValue, 
    getAvailablePortfolioValue 
  } = useTokens();
  const { walletBalance, addFunds, deductFunds } = useWallet();
  
  // Initialize loan hook with functions from other hooks
  const { loans, addLoan, repayLoan } = useLoans(
    addTransaction,
    lockToken,
    unlockToken,
    addFunds,
    deductFunds,
    getTokenByLoanId
  );

  // Enhance transaction with token name resolution
  const enhancedAddTransaction = (transaction: any) => {
    // Resolve token name from ID if needed
    if (transaction.asset && !transaction.asset.includes(' ')) {
      const token = tokens.find(t => t.id === transaction.asset);
      if (token) {
        transaction = {
          ...transaction,
          asset: token.name
        };
      }
    }
    
    addTransaction(transaction);
  };

  return (
    <PortfolioContext.Provider value={{ 
      tokens, 
      walletBalance,
      transactions,
      loans,
      addToken, 
      removeToken, 
      updateTokenBalance,
      lockToken,
      unlockToken,
      getTotalPortfolioValue,
      getAvailablePortfolioValue,
      addFunds,
      deductFunds,
      addTransaction: enhancedAddTransaction,
      addLoan,
      repayLoan,
      isLoading
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
