
import { useState, useEffect } from "react";
import { Transaction } from "../types";
import { fetchTransactions, saveTransaction } from "../portfolioService";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Add initial loan transaction
  useEffect(() => {
    const initialLoanTransaction: Transaction = {
      id: "loan-tx-1",
      date: "2023-12-15T10:00:00Z",
      type: 'loan',
      asset: "Digital Gold",
      amount: 0.1,
      value: 10000,
      status: 'completed'
    };
    
    setTransactions(prev => [initialLoanTransaction, ...prev]);
  }, []);

  // Fetch transactions from Supabase on component mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTransactions();
        // Merge with our initial loan transaction
        const mergedTransactions = [...data];
        setTransactions(prev => {
          // Combine existing local transactions with fetched ones
          const localTxIds = prev.map(tx => tx.id);
          const uniqueRemoteTxs = mergedTransactions.filter(tx => !localTxIds.includes(tx.id));
          return [...prev, ...uniqueRemoteTxs];
        });
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Add transaction to history and save to Supabase
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    // Add to local state first for immediate UI update
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Then save to Supabase
    try {
      await saveTransaction(transaction);
    } catch (error) {
      console.error('Error in addTransaction:', error);
    }
  };

  return {
    transactions,
    isLoading,
    addTransaction
  };
};
