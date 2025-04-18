
import React, { ReactNode } from "react";
import { PortfolioContextType } from "../types";
import { useTransactions, useTokens, useWallet, useLoans } from "../hooks";
import { PortfolioContext } from "./PortfolioContext";
import { useUserDataLoader } from "./useUserDataLoader";
import { useEnhancedTransactions } from "./useEnhancedTransactions";

export interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider = ({ children }: PortfolioProviderProps) => {
  // Initialize hooks for different parts of the portfolio functionality
  const { 
    transactions, 
    isLoading, 
    addTransaction,
    loadTransactions,
    seedInitialTransactions
  } = useTransactions();
  
  const { 
    tokens, 
    setTokens,
    addToken, 
    removeToken, 
    updateTokenBalance, 
    lockToken, 
    unlockToken,
    getTokenByLoanId,
    getTotalPortfolioValue, 
    getAvailablePortfolioValue,
    loadTokensFromStorage,
    saveTokensToStorage,
    toggleTokenStaking
  } = useTokens();
  
  const { 
    walletBalance, 
    setWalletBalance,
    addFunds, 
    deductFunds,
    loadWalletBalance,
    saveWalletBalance
  } = useWallet();
  
  // Initialize loan hook with functions from other hooks
  const { loans, addLoan, repayLoan } = useLoans(
    addTransaction,
    lockToken,
    unlockToken,
    addFunds,
    deductFunds,
    getTokenByLoanId
  );

  // Load user data and handle authentication state changes
  useUserDataLoader(
    loadTokensFromStorage,
    setTokens,
    loadWalletBalance,
    setWalletBalance,
    loadTransactions,
    saveTokensToStorage,
    saveWalletBalance,
    tokens,
    walletBalance
  );

  // Set up enhanced transaction handling
  const { enhancedAddTransaction } = useEnhancedTransactions(
    tokens,
    addTransaction,
    saveTokensToStorage,
    saveWalletBalance,
    walletBalance
  );

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
      isLoading,
      toggleTokenStaking,
      seedInitialTransactions,
      loadTransactions
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
