
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { initialTokens, initialWalletBalance } from "./initialData";
import { fetchTransactions, saveTransaction } from "./portfolioService";
import { Token, Transaction, PortfolioContextType } from "./types";

export const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [walletBalance, setWalletBalance] = useState<number>(initialWalletBalance);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch transactions from Supabase on component mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const addToken = (token: Token) => {
    setTokens(prev => [...prev, token]);
  };

  const removeToken = (id: string) => {
    setTokens(prev => prev.filter(token => token.id !== id));
  };

  const updateTokenBalance = (id: string, amount: number) => {
    setTokens(prev => 
      prev.map(token => 
        token.id === id 
          ? { ...token, balance: token.balance + amount } 
          : token
      )
    );
  };

  const getTotalPortfolioValue = () => {
    return tokens.reduce((total, token) => total + (token.price * token.balance), 0);
  };

  // Add funds to wallet
  const addFunds = (amount: number) => {
    setWalletBalance(prev => prev + amount);
  };

  // Deduct funds from wallet, returns true if successful, false if insufficient funds
  const deductFunds = (amount: number) => {
    if (walletBalance >= amount) {
      setWalletBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  // Add transaction to history and save to Supabase
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    // Add to local state first for immediate UI update
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Then save to Supabase
    try {
      await saveTransaction(transaction);
    } catch (error) {
      console.error('Error in addTransaction:', error);
    }
  };

  return (
    <PortfolioContext.Provider value={{ 
      tokens, 
      walletBalance,
      transactions,
      addToken, 
      removeToken, 
      updateTokenBalance,
      getTotalPortfolioValue,
      addFunds,
      deductFunds,
      addTransaction,
      isLoading
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
