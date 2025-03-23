
import { useState } from "react";
import { initialWalletBalance } from "../initialData";
import { supabase } from "@/integrations/supabase/client";

export const useWallet = () => {
  const [walletBalance, setWalletBalance] = useState<number>(0); // Default to 0 instead of initialWalletBalance

  // Load wallet balance from Supabase
  const loadWalletBalance = async (): Promise<number | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      // Use raw query to get around type limitations
      const { data, error } = await supabase
        .from('user_portfolio')
        .select('wallet_balance')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        // If no data exists yet, return null
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      
      return data?.wallet_balance !== undefined ? Number(data.wallet_balance) : null;
    } catch (error) {
      console.error('Error loading wallet balance:', error);
      return null;
    }
  };

  // Save wallet balance to Supabase
  const saveWalletBalance = async (balance: number) => {
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
      
      if (data) {
        // Update existing record
        const { error } = await supabase
          .from('user_portfolio')
          .update({ wallet_balance: balance })
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_portfolio')
          .insert({ 
            user_id: user.id, 
            wallet_balance: balance 
          });
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving wallet balance:', error);
    }
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

  return {
    walletBalance,
    setWalletBalance,
    addFunds,
    deductFunds,
    loadWalletBalance,
    saveWalletBalance
  };
};
