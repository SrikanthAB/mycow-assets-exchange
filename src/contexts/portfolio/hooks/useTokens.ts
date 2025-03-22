
import { useState } from "react";
import { Token } from "../types";
import { initialTokens } from "../initialData";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export const useTokens = () => {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);

  // Load tokens from Supabase
  const loadTokensFromStorage = async (): Promise<Token[] | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      // Use raw query to get around type limitations
      const { data, error } = await supabase
        .from('user_portfolio')
        .select('tokens')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        // If no data exists yet, return null
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      
      // Convert from Json to Token[] with proper type checking
      if (data?.tokens && Array.isArray(data.tokens)) {
        return data.tokens as Token[];
      }
      
      return null;
    } catch (error) {
      console.error('Error loading tokens:', error);
      return null;
    }
  };

  // Save tokens to Supabase
  const saveTokensToStorage = async (tokensToSave: Token[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      // Check if user record exists
      const { data, error: selectError } = await supabase
        .from('user_portfolio')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }
      
      // Convert tokens to a format compatible with Supabase's Json type
      const tokensJson = tokensToSave as unknown as Json;
      
      if (data) {
        // Update existing record
        const { error } = await supabase
          .from('user_portfolio')
          .update({ tokens: tokensJson })
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_portfolio')
          .insert({ 
            user_id: user.id, 
            tokens: tokensJson 
          });
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  };

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
    saveTokensToStorage
  };
};
