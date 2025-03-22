
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define token types
export interface Token {
  id: string;
  name: string;
  symbol: string;
  category: string;
  price: number;
  priceString: string;
  change: number;
  balance: number;
  image?: string;
  yield?: string;
}

// Define transaction interface
export interface Transaction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal';
  asset?: string;
  amount: number;
  value: number;
  status: 'completed' | 'pending' | 'failed';
}

interface PortfolioContextType {
  tokens: Token[];
  walletBalance: number;
  transactions: Transaction[];
  addToken: (token: Token) => void;
  removeToken: (id: string) => void;
  updateTokenBalance: (id: string, amount: number) => void;
  getTotalPortfolioValue: () => number;
  addFunds: (amount: number) => void;
  deductFunds: (amount: number) => boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Initial portfolio with some RWA tokens
const initialTokens: Token[] = [
  {
    id: "1",
    name: "Embassy REIT",
    symbol: "EMREIT",
    category: "Real Estate",
    price: 356.42,
    priceString: "₹356.42",
    change: 2.34,
    balance: 10,
    yield: "8.5% APY"
  },
  {
    id: "2",
    name: "Digital Gold",
    symbol: "DGOLD",
    category: "Commodity",
    price: 7245.30,
    priceString: "₹7,245.30",
    change: 0.87,
    balance: 2.5,
    yield: "0.5% APY"
  },
  {
    id: "3",
    name: "Movie Fund I",
    symbol: "MF01",
    category: "Entertainment",
    price: 115.67,
    priceString: "₹115.67",
    change: 12.43,
    balance: 25,
    yield: "14.2% APY"
  },
  {
    id: "6",
    name: "MyCow Token",
    symbol: "MCT",
    category: "Native Token",
    price: 24.37,
    priceString: "₹24.37",
    change: 5.63,
    balance: 100,
    yield: "7.8% APY"
  }
];

// Initial wallet balance (10,00,000 rupees as requested)
const initialWalletBalance = 1000000;

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [walletBalance, setWalletBalance] = useState<number>(initialWalletBalance);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch transactions from Supabase on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) {
          console.error('Error fetching transactions:', error);
          return;
        }
        
        if (data) {
          // Transform data to match our Transaction interface
          const formattedTransactions: Transaction[] = data.map(item => ({
            id: item.id,
            date: item.date,
            type: item.type as 'buy' | 'sell' | 'deposit' | 'withdrawal',
            asset: item.asset,
            amount: Number(item.amount),
            value: Number(item.value),
            status: item.status as 'completed' | 'pending' | 'failed'
          }));
          
          setTransactions(formattedTransactions);
        }
      } catch (error) {
        console.error('Error in fetchTransactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
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
      const { error } = await supabase
        .from('transactions')
        .insert({
          type: transaction.type,
          asset: transaction.asset,
          amount: transaction.amount,
          value: transaction.value,
          status: transaction.status
        });
        
      if (error) {
        console.error('Error adding transaction to Supabase:', error);
      }
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

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
