import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "./types";

// Modify the transaction cache to be more persistent
let transactionCache: { 
  userId: string | null,
  data: Transaction[], 
  timestamp: number 
} = { 
  userId: null, 
  data: [], 
  timestamp: 0 
};

// Remove cache expiration to keep data consistent
export const fetchTransactions = async () => {
  try {
    console.log("Fetching transactions from Supabase");
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found when fetching transactions');
      return [];
    }
    
    // If we already have cached data for this user, return it
    if (transactionCache.userId === user.id && transactionCache.data.length > 0) {
      console.log("Using cached transactions data");
      return transactionCache.data;
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    const formattedTransactions: Transaction[] = data?.map(item => ({
      id: item.id,
      date: item.date,
      type: item.type as 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'lock' | 'unlock' | 'loan' | 'repayment' | 'stake' | 'unstake' | 'swap',
      asset: item.asset,
      amount: Number(item.amount),
      value: Number(item.value),
      status: item.status as 'completed' | 'pending' | 'failed',
      toAsset: item.to_asset
    })) || [];
    
    // Update the cache with user-specific data
    transactionCache = {
      userId: user.id,
      data: formattedTransactions,
      timestamp: Date.now()
    };
    
    return formattedTransactions;
  } catch (error) {
    console.error('Error in fetchTransactions:', error);
    // Reset cache on error
    transactionCache = { userId: null, data: [], timestamp: 0 };
    throw error;
  }
};

export const saveTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found when saving transaction');
      throw new Error('User must be authenticated to save transactions');
    }
    
    const currentDate = new Date().toISOString();
    
    const transactionData = {
      type: transaction.type,
      asset: transaction.asset,
      amount: transaction.amount,
      value: transaction.value,
      status: transaction.status,
      user_id: user.id, 
      to_asset: transaction.toAsset,
      date: currentDate
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error adding transaction to Supabase:', error);
      throw error;
    }
    
    const formattedTransaction: Transaction = {
      id: data.id,
      date: data.date,
      type: data.type as 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'lock' | 'unlock' | 'loan' | 'repayment' | 'stake' | 'unstake' | 'swap',
      asset: data.asset,
      amount: Number(data.amount),
      value: Number(data.value),
      status: data.status as 'completed' | 'pending' | 'failed',
      toAsset: data.to_asset
    };
    
    // Always update the cache for the current user
    if (transactionCache.userId === user.id) {
      transactionCache.data = [formattedTransaction, ...transactionCache.data];
    } else {
      transactionCache = {
        userId: user.id,
        data: [formattedTransaction],
        timestamp: Date.now()
      };
    }
    
    return formattedTransaction;
  } catch (error) {
    console.error('Error in saveTransaction:', error);
    throw error;
  }
};
