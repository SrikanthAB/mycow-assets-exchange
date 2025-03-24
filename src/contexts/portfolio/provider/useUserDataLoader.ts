
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Token } from '../types';

export const useUserDataLoader = (
  loadTokensFromStorage: () => Promise<Token[] | null>,
  setTokens: (tokens: Token[]) => void,
  loadWalletBalance: () => Promise<number | null>,
  setWalletBalance: (balance: number) => void,
  loadTransactions: () => Promise<void>,
  saveTokensToStorage: (tokens: Token[]) => Promise<void>,
  saveWalletBalance: (balance: number) => Promise<void>,
  tokens: Token[],
  walletBalance: number
) => {
  // Track if initial data has been loaded
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Load user data on initial load
  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log("Starting to load user portfolio data");
        
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log("Loading user data for user:", user.id);
          
          // Load tokens and wallet balance
          const userTokens = await loadTokensFromStorage();
          if (userTokens && userTokens.length > 0) {
            console.log("Loaded user tokens:", userTokens.length);
            setTokens(userTokens);
          } else {
            console.log("No tokens found in storage, using empty token list for new user");
            setTokens([]);
          }
          
          const userWalletBalance = await loadWalletBalance();
          if (userWalletBalance !== null) {
            console.log("Loaded wallet balance:", userWalletBalance);
            setWalletBalance(userWalletBalance);
          } else {
            console.log("No wallet balance found, setting to zero");
            setWalletBalance(0);
          }
          
          // Reload transactions to ensure they're up to date
          await loadTransactions();
        } else {
          console.log("No authenticated user found");
        }
        
        setIsInitialLoadComplete(true);
      } catch (error) {
        console.error("Error loading user portfolio data:", error);
        setIsInitialLoadComplete(true);
      }
    };

    loadUserData();
  }, []);

  // Save tokens and wallet balance whenever they change
  useEffect(() => {
    const saveData = async () => {
      try {
        // Only save if initial load is complete and user is authenticated
        if (isInitialLoadComplete) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            console.log("Saving tokens and wallet balance to storage");
            await saveTokensToStorage(tokens);
            await saveWalletBalance(walletBalance);
          }
        }
      } catch (error) {
        console.error("Error saving portfolio data:", error);
      }
    };

    saveData();
  }, [tokens, walletBalance, isInitialLoadComplete]);

  // Listen for auth state changes to reload data when user logs in/out
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN') {
        // Reload all user data on sign in
        const userTokens = await loadTokensFromStorage();
        setTokens(userTokens || []);
        
        const userWalletBalance = await loadWalletBalance();
        setWalletBalance(userWalletBalance !== null ? userWalletBalance : 0);
        
        await loadTransactions();
      } else if (event === 'SIGNED_OUT') {
        // Clear data on sign out
        setTokens([]);
        setWalletBalance(0);
        setIsInitialLoadComplete(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    isInitialLoadComplete
  };
};
