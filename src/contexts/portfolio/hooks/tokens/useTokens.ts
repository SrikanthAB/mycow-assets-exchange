
import { useState } from "react";
import { Token } from "../../types";
import { initialTokens } from "../../initialData";
import { loadTokensFromStorage, saveTokensToStorage } from "./tokenStorage";
import * as tokenOps from "./tokenOperations";

/**
 * Hook for managing tokens in the portfolio
 * @returns Object with token state and operations
 */
export const useTokens = () => {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);

  const addToken = (token: Token) => {
    setTokens(prev => [...prev, token]);
  };

  const removeToken = (id: string) => {
    setTokens(prev => prev.filter(token => token.id !== id));
  };

  const updateTokenBalance = (id: string, amount: number) => {
    setTokens(prev => tokenOps.updateTokenBalance(prev, id, amount));
  };

  const lockToken = (id: string, amount: number, loanId: string) => {
    setTokens(prev => tokenOps.lockToken(prev, id, amount, loanId));
  };

  const unlockToken = (id: string) => {
    setTokens(prev => tokenOps.unlockToken(prev, id));
  };

  const getTokenByLoanId = (loanId: string) => {
    return tokenOps.getTokenByLoanId(tokens, loanId);
  };

  const getTotalPortfolioValue = () => {
    return tokenOps.getTotalPortfolioValue(tokens);
  };

  const getAvailablePortfolioValue = () => {
    return tokenOps.getAvailablePortfolioValue(tokens);
  };

  const toggleTokenStaking = (id: string, isStaked: boolean, yieldRate?: string) => {
    setTokens(prev => tokenOps.toggleTokenStaking(prev, id, isStaked, yieldRate));
  };

  return {
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
  };
};
