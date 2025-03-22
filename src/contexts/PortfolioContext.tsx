
import React, { createContext, useContext, useState, ReactNode } from "react";

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

// Initial transactions
const initialTransactions: Transaction[] = [
  {
    id: '1',
    date: '2023-10-15T10:30:00',
    type: 'buy',
    asset: 'Embassy REIT',
    amount: 5,
    value: 1782.10,
    status: 'completed'
  },
  {
    id: '2',
    date: '2023-10-10T14:45:00',
    type: 'deposit',
    amount: 50000,
    value: 50000,
    status: 'completed'
  },
  {
    id: '3',
    date: '2023-10-05T09:15:00',
    type: 'sell',
    asset: 'Digital Gold',
    amount: 1.5,
    value: 10867.95,
    status: 'completed'
  },
  {
    id: '4',
    date: '2023-09-28T16:20:00',
    type: 'buy',
    asset: 'Movie Fund I',
    amount: 10,
    value: 1156.70,
    status: 'completed'
  },
  {
    id: '5',
    date: '2023-09-20T11:05:00',
    type: 'withdrawal',
    amount: 25000,
    value: 25000,
    status: 'completed'
  }
];

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [walletBalance, setWalletBalance] = useState<number>(initialWalletBalance);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

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

  // Add transaction to history
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
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
      addTransaction
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
