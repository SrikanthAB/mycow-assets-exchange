
import React, { createContext, ReactNode, useEffect } from "react";
import { PortfolioContextType } from "./types";
import { useTransactions, useTokens, useWallet, useLoans } from "./hooks";
import { supabase } from "@/integrations/supabase/client";

export const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  // Initialize hooks for different parts of the portfolio functionality
  const { transactions, isLoading, addTransaction } = useTransactions();
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

  // Enhance transaction with token name resolution
  const enhancedAddTransaction = async (transaction: any) => {
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
    
    // Add transaction to history
    await addTransaction(transaction);

    // Save tokens and wallet balance after transaction is added
    await saveTokensToStorage(tokens);
    await saveWalletBalance(walletBalance);
  };

  // Load user data on initial load
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Load tokens and wallet balance
          const userTokens = await loadTokensFromStorage();
          if (userTokens && userTokens.length > 0) {
            setTokens(userTokens);
          }
          
          const userWalletBalance = await loadWalletBalance();
          if (userWalletBalance !== null) {
            setWalletBalance(userWalletBalance);
          }
        }
      } catch (error) {
        console.error("Error loading user portfolio data:", error);
      }
    };

    loadUserData();
  }, []);

  // Save tokens and wallet balance whenever they change
  useEffect(() => {
    const saveData = async () => {
      try {
        await saveTokensToStorage(tokens);
        await saveWalletBalance(walletBalance);
      } catch (error) {
        console.error("Error saving portfolio data:", error);
      }
    };

    // Skip initial save
    if (!isLoading) {
      saveData();
    }
  }, [tokens, walletBalance, isLoading]);

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
      toggleTokenStaking
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
