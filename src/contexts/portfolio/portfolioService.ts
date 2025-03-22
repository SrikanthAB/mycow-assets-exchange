
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "./types";

export const fetchTransactions = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found when fetching transactions');
      return [];
    }
    
    // Fetch transactions specifically for this user
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    // Transform data to match our Transaction interface
    const formattedTransactions: Transaction[] = data.map(item => ({
      id: item.id,
      date: item.date,
      type: item.type as 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'lock' | 'unlock' | 'loan' | 'repayment',
      asset: item.asset,
      amount: Number(item.amount),
      value: Number(item.value),
      status: item.status as 'completed' | 'pending' | 'failed',
      toAsset: item.to_asset
    }));
    
    return formattedTransactions;
  } catch (error) {
    console.error('Error in fetchTransactions:', error);
    throw error;
  }
};

export const saveTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found when saving transaction');
      throw new Error('User must be authenticated to save transactions');
    }
    
    const { error } = await supabase
      .from('transactions')
      .insert({
        type: transaction.type,
        asset: transaction.asset,
        amount: transaction.amount,
        value: transaction.value,
        status: transaction.status,
        user_id: user.id, // Add the user_id to the transaction record
        to_asset: transaction.toAsset // Include the destination asset for swap transactions
      });
      
    if (error) {
      console.error('Error adding transaction to Supabase:', error);
      throw error;
    }
    
    console.log('Transaction saved successfully with user_id:', user.id);
  } catch (error) {
    console.error('Error in saveTransaction:', error);
    throw error;
  }
};
