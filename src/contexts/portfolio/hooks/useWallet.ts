
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useWallet = () => {
  const [walletBalance, setWalletBalance] = useState<number>(0); // Default to 0 instead of initialWalletBalance

  // Load wallet balance from Supabase
  const loadWalletBalance = async (): Promise<number | null> => {
    try {
      console.log("Loading wallet balance from Supabase");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No authenticated user found when loading wallet balance");
        return null;
      }
      
      console.log("Fetching wallet balance for user:", user.id);
      
      // Use raw query to get around type limitations
      const { data, error } = await supabase
        .from('user_portfolio')
        .select('wallet_balance')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        // If no data exists yet, return null
        if (error.code === 'PGRST116') {
          console.log("No wallet balance found for this user, returning null");
          return null;
        }
        throw error;
      }
      
      console.log("Wallet balance loaded:", data?.wallet_balance);
      return data?.wallet_balance !== undefined ? Number(data.wallet_balance) : null;
    } catch (error) {
      console.error('Error loading wallet balance:', error);
      return null;
    }
  };

  // Save wallet balance to Supabase
  const saveWalletBalance = async (balance: number) => {
    try {
      console.log("Saving wallet balance to Supabase:", balance);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No authenticated user found when saving wallet balance");
        return;
      }
      
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
        console.log("Updating existing wallet balance record");
        const { error } = await supabase
          .from('user_portfolio')
          .update({ wallet_balance: balance })
          .eq('user_id', user.id);
        
        if (error) throw error;
        console.log("Wallet balance updated successfully");
      } else {
        // Insert new record
        console.log("Creating new wallet balance record");
        const { error } = await supabase
          .from('user_portfolio')
          .insert({ 
            user_id: user.id, 
            wallet_balance: balance 
          });
        
        if (error) throw error;
        console.log("New wallet balance record created successfully");
      }
    } catch (error) {
      console.error('Error saving wallet balance:', error);
    }
  };

  // Add funds to wallet
  const addFunds = (amount: number) => {
    console.log("Adding funds to wallet:", amount);
    setWalletBalance(prev => {
      const newBalance = prev + amount;
      console.log("New wallet balance:", newBalance);
      // Save the updated balance to Supabase
      saveWalletBalance(newBalance);
      return newBalance;
    });
  };

  // Deduct funds from wallet, returns true if successful, false if insufficient funds
  const deductFunds = (amount: number) => {
    console.log("Attempting to deduct funds:", amount, "Current balance:", walletBalance);
    if (walletBalance >= amount) {
      setWalletBalance(prev => {
        const newBalance = prev - amount;
        console.log("New wallet balance after deduction:", newBalance);
        // Save the updated balance to Supabase
        saveWalletBalance(newBalance);
        return newBalance;
      });
      return true;
    }
    console.log("Insufficient funds for deduction");
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
