
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "./types";

// Cache for transactions to avoid redundant fetches
let transactionCache: { 
  userId: string | null,
  data: Transaction[], 
  timestamp: number 
} = { 
  userId: null, 
  data: [], 
  timestamp: 0 
};

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

export const fetchTransactions = async () => {
  try {
    console.log("Fetching transactions from Supabase");
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found when fetching transactions');
      return [];
    }
    
    // Check if we have valid cached data for this user
    const now = Date.now();
    if (
      transactionCache.userId === user.id && 
      transactionCache.data.length > 0 && 
      now - transactionCache.timestamp < CACHE_EXPIRATION
    ) {
      console.log("Using cached transactions data");
      return transactionCache.data;
    }
    
    // Fetch transactions specifically for this user with optimized query
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} transactions from Supabase for user ${user.id}`);
    
    // Transform data to match our Transaction interface
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
    
    // Update the cache
    transactionCache = {
      userId: user.id,
      data: formattedTransactions,
      timestamp: now
    };
    
    return formattedTransactions;
  } catch (error) {
    console.error('Error in fetchTransactions:', error);
    throw error;
  }
};

export const saveTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
  try {
    console.log('Saving transaction to Supabase:', transaction);
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found when saving transaction');
      throw new Error('User must be authenticated to save transactions');
    }
    
    // Create a current date in ISO format
    const currentDate = new Date().toISOString();
    
    // Insert the transaction record
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        type: transaction.type,
        asset: transaction.asset,
        amount: transaction.amount,
        value: transaction.value,
        status: transaction.status,
        user_id: user.id, 
        to_asset: transaction.toAsset,
        date: currentDate
      })
      .select('*')
      .single();
      
    if (error) {
      console.error('Error adding transaction to Supabase:', error);
      throw error;
    }
    
    console.log('Transaction saved successfully in Supabase:', data);
    
    // Format the created transaction
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
    
    // Update the cache with the new transaction
    if (transactionCache.userId === user.id) {
      transactionCache.data = [formattedTransaction, ...transactionCache.data];
      transactionCache.timestamp = Date.now();
    }
    
    return formattedTransaction;
  } catch (error) {
    console.error('Error in saveTransaction:', error);
    throw error;
  }
};
