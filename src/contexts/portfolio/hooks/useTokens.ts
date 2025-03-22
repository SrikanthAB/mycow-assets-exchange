
import { useState, useEffect } from "react";
import { Token } from "../types";
import { initialTokens } from "../initialData";

export const useTokens = () => {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);

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

  const getTokenByLoanId = (loanId: string) => {
    return tokens.find(token => token.loanId === loanId);
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

  return {
    tokens,
    addToken,
    removeToken,
    updateTokenBalance,
    lockToken,
    unlockToken,
    getTokenByLoanId,
    getTotalPortfolioValue,
    getAvailablePortfolioValue
  };
};
