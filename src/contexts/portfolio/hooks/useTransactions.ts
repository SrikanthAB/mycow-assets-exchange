
import { useState, useEffect } from "react";
import { Transaction } from "../types";
import { fetchTransactions, saveTransaction } from "../portfolioService";
import { initialTokens } from "../initialData";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch transactions from Supabase on component mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated before fetching transactions
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No authenticated user, not loading transactions");
          setTransactions([]);
          setIsLoading(false);
          return;
        }
        
        console.log("Fetching transactions for user:", user.id);
        const data = await fetchTransactions();
        console.log("Transactions received from Supabase:", data);
        
        if (data && data.length > 0) {
          setTransactions(data);
        } else {
          console.log("No transactions found for this user");
          setTransactions([]);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        toast({
          title: "Error loading transactions",
          description: "There was a problem loading your transaction history.",
          variant: "destructive"
        });
        setTransactions([]);
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
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to seed transactions.",
          variant: "destructive"
        });
        return;
      }

      // Get current date
      const today = new Date();
      
      // Create initial transactions (same as in the useEffect above)
      const initialTransactionsToSeed = [
        // Updated loan transaction date to be more recent
        {
          type: 'loan' as const,
          asset: "Digital Gold",
          amount: 0.1,
          value: 10000,
          status: 'completed' as const
        },
        // Purchase transactions for all initial tokens
        {
          type: 'buy' as const,
          asset: "Embassy REIT",
          amount: 10,
          value: 3564.20,
          status: 'completed' as const
        },
        {
          type: 'buy' as const,
          asset: "Digital Gold",
          amount: 2.5,
          value: 18113.25,
          status: 'completed' as const
        },
        {
          type: 'buy' as const,
          asset: "Movie Fund I",
          amount: 25,
          value: 2891.75,
          status: 'completed' as const
        },
        {
          type: 'buy' as const,
          asset: "MyCow Token",
          amount: 100,
          value: 2437.00,
          status: 'completed' as const
        },
        // Add a deposit transaction
        {
          type: 'deposit' as const,
          asset: "Wallet",
          amount: 1,
          value: 1000000,
          status: 'completed' as const
        },
        // Add a small sell transaction
        {
          type: 'sell' as const,
          asset: "Movie Fund I",
          amount: 5,
          value: 578.35,
          status: 'completed' as const
        }
      ];
      
      // Save each transaction to Supabase
      for (const tx of initialTransactionsToSeed) {
        await saveTransaction(tx);
      }
      
      console.log("Seeded initial transactions to Supabase for user:", user.id);
      
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
