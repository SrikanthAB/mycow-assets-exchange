
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { initialTokens, initialWalletBalance } from "./initialData";
import { fetchTransactions, saveTransaction } from "./portfolioService";
import { Token, Transaction, Loan, PortfolioContextType } from "./types";

export const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [walletBalance, setWalletBalance] = useState<number>(initialWalletBalance);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([{
    id: "loan1",
    amount: 10000,
    collateralToken: "digital-gold",
    collateralAmount: 0.1,
    collateralValue: 15000,
    collateralRatio: 150,
    interestRate: 9.5,
    term: 90,
    startDate: "2023-12-15",
    remainingDays: 45,
    status: 'active'
  }]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Update initial tokens to reflect locked gold
  useEffect(() => {
    setTokens(prev => 
      prev.map(token => 
        token.id === "digital-gold" 
          ? { 
              ...token, 
              locked: true, 
              lockedAmount: 0.1,
              loanId: "loan1"
            } 
          : token
      )
    );
  }, []);

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

  const lockToken = (id: string, amount: number, loanId: string) => {
    setTokens(prev => 
      prev.map(token => 
        token.id === id 
          ? { 
              ...token, 
              locked: true, 
              lockedAmount: (token.lockedAmount || 0) + amount,
              loanId: loanId
            } 
          : token
      )
    );
  };

  const unlockToken = (id: string) => {
    setTokens(prev => 
      prev.map(token => 
        token.id === id 
          ? { 
              ...token, 
              locked: false, 
              lockedAmount: 0,
              loanId: undefined
            } 
          : token
      )
    );
  };

  const getTotalPortfolioValue = () => {
    return tokens.reduce((total, token) => total + (token.price * token.balance), 0);
  };

  const getAvailablePortfolioValue = () => {
    return tokens.reduce((total, token) => {
      if (token.locked && token.lockedAmount) {
        const availableBalance = token.balance - token.lockedAmount;
        return total + (token.price * Math.max(0, availableBalance));
      }
      return total + (token.price * token.balance);
    }, 0);
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
    
    // Add transaction
    addTransaction({
      type: 'lock',
      asset: tokens.find(t => t.id === loan.collateralToken)?.name || loan.collateralToken,
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
    const lockedToken = tokens.find(token => token.loanId === id);
    
    if (lockedToken) {
      unlockToken(lockedToken.id);
      
      // Add transaction
      addTransaction({
        type: 'unlock',
        asset: lockedToken.name,
        amount: lockedToken.lockedAmount || 0,
        value: (lockedToken.lockedAmount || 0) * lockedToken.price,
        status: 'completed'
      });
    }
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
      addTransaction,
      addLoan,
      repayLoan,
      isLoading
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
