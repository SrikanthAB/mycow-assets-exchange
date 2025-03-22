import { useState, useEffect } from "react";
import { Transaction } from "../types";
import { fetchTransactions, saveTransaction } from "../portfolioService";
import { initialTokens } from "../initialData";
import { useToast } from "@/components/ui/use-toast";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Add initial transactions to reflect the current portfolio (only for demo)
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
    
    // Only apply initial transactions when no transactions exist yet and we're still loading
    // This ensures we don't wipe out transactions loaded from the database
    if (isLoading) {
      setTransactions(prev => {
        if (prev.length === 0) {
          return initialTransactions;
        }
        return prev;
      });
    }
  }, [isLoading]);

  // Fetch transactions from Supabase on component mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching transactions from Supabase...");
        const data = await fetchTransactions();
        console.log("Transactions received from Supabase:", data);
        
        if (data && data.length > 0) {
          // If we have data from the database, use it instead of initial demo data
          setTransactions(data);
        } else {
          // Only use demo data if we don't have any transactions in the database
          console.log("No transactions found in database, using initial demo data");
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        toast({
          title: "Error loading transactions",
          description: "There was a problem loading your transaction history.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [toast]);

  // Add transaction to history and save to Supabase
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
      console.log("Saving transaction to Supabase:", transaction);
      
      // First save to Supabase to ensure it gets stored in the database
      const savedTransaction = await saveTransaction(transaction);
      console.log("Transaction saved to Supabase with id:", savedTransaction.id);
      
      // Update local state with the transaction returned from Supabase
      setTransactions(prev => [savedTransaction, ...prev]);
      
      toast({
        title: "Transaction recorded",
        description: "Your transaction has been successfully saved.",
      });
      
      return savedTransaction;
    } catch (error) {
      console.error('Error in addTransaction:', error);
      toast({
        title: "Transaction failed",
        description: "There was a problem saving your transaction.",
        variant: "destructive"
      });
      throw error; // Re-throw to allow handling in UI components
    }
  };

  // Helper function to seed initial transactions to Supabase (only for development)
  const seedInitialTransactions = async () => {
    try {
      // Get initial transactions from the first useEffect
      const today = new Date();
      
      // Create initial transactions (same as in the useEffect above)
      const initialTransactionsToSeed = [
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
      
      // Save each transaction to Supabase
      for (const tx of initialTransactionsToSeed) {
        const { id, date, ...txWithoutIdAndDate } = tx;
        await saveTransaction(txWithoutIdAndDate);
      }
      
      console.log("Seeded initial transactions to Supabase");
      
      // Reload transactions from Supabase
      const freshData = await fetchTransactions();
      setTransactions(freshData);
      
      toast({
        title: "Initial transactions seeded",
        description: "Default transactions have been added to your account.",
      });
    } catch (error) {
      console.error("Error seeding initial transactions:", error);
      toast({
        title: "Seeding failed",
        description: "There was a problem adding initial transactions.",
        variant: "destructive"
      });
    }
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    seedInitialTransactions // Export this for development use
  };
};
