
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "./types";

export const fetchTransactions = async () => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    // Transform data to match our Transaction interface
    const formattedTransactions: Transaction[] = data.map(item => ({
      id: item.id,
      date: item.date,
      type: item.type as 'buy' | 'sell' | 'deposit' | 'withdrawal',
      asset: item.asset,
      amount: Number(item.amount),
      value: Number(item.value),
      status: item.status as 'completed' | 'pending' | 'failed'
    }));
    
    return formattedTransactions;
  } catch (error) {
    console.error('Error in fetchTransactions:', error);
    throw error;
  }
};

export const saveTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
  try {
    const { error } = await supabase
      .from('transactions')
      .insert({
        type: transaction.type,
        asset: transaction.asset,
        amount: transaction.amount,
        value: transaction.value,
        status: transaction.status
      });
      
    if (error) {
      console.error('Error adding transaction to Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in saveTransaction:', error);
    throw error;
  }
};
