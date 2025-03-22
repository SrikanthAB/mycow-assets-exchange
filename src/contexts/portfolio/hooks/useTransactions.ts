
import { useState, useEffect } from "react";
import { Transaction } from "../types";
import { fetchTransactions, saveTransaction } from "../portfolioService";
import { initialTokens } from "../initialData";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Add initial transactions to reflect the current portfolio
  useEffect(() => {
    // Get current date
    const today = new Date();
    
    // Create transactions for the past week
    const initialTransactions: Transaction[] = [
      // Updated loan transaction date to be more recent
      {
        id: "loan-tx-1",
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        type: 'loan',
        asset: "Digital Gold",
        amount: 0.1,
        value: 10000,
        status: 'completed'
      },
      // Purchase transactions for all initial tokens
      {
        id: "purchase-tx-1",
        date: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
        type: 'buy',
        asset: "Embassy REIT",
        amount: 10,
        value: 3564.20,
        status: 'completed'
      },
      {
        id: "purchase-tx-2",
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        type: 'buy',
        asset: "Digital Gold",
        amount: 2.5,
        value: 18113.25,
        status: 'completed'
      },
      {
        id: "purchase-tx-3",
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        type: 'buy',
        asset: "Movie Fund I",
        amount: 25,
        value: 2891.75,
        status: 'completed'
      },
      {
        id: "purchase-tx-4",
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        type: 'buy',
        asset: "MyCow Token",
        amount: 100,
        value: 2437.00,
        status: 'completed'
      },
      // Add a deposit transaction
      {
        id: "deposit-tx-1",
        date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        type: 'deposit',
        asset: "Wallet",
        amount: 1,
        value: 1000000,
        status: 'completed'
      },
      // Add a small sell transaction
      {
        id: "sell-tx-1",
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        type: 'sell',
        asset: "Movie Fund I",
        amount: 5,
        value: 578.35,
        status: 'completed'
      }
    ];
    
    setTransactions(prev => [...initialTransactions, ...prev.filter(tx => 
      // Filter out any transaction with the same ID as our initial transactions
      !initialTransactions.some(init => init.id === tx.id)
    )]);
  }, []);

  // Fetch transactions from Supabase on component mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTransactions();
        // Merge with our initial transactions
        setTransactions(prev => {
          // Combine existing local transactions with fetched ones
          const localTxIds = prev.map(tx => tx.id);
          const uniqueRemoteTxs = data.filter(tx => !localTxIds.includes(tx.id));
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
