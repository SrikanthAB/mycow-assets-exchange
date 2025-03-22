
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

interface PortfolioContextType {
  tokens: Token[];
  walletBalance: number;
  addToken: (token: Token) => void;
  removeToken: (id: string) => void;
  updateTokenBalance: (id: string, amount: number) => void;
  getTotalPortfolioValue: () => number;
  addFunds: (amount: number) => void;
  deductFunds: (amount: number) => boolean;
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

  return (
    <PortfolioContext.Provider value={{ 
      tokens, 
      walletBalance,
      addToken, 
      removeToken, 
      updateTokenBalance,
      getTotalPortfolioValue,
      addFunds,
      deductFunds
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
