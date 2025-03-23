
import { useState, useEffect } from "react";
import { Transaction } from "../../types";
import { fetchTransactions, saveTransaction } from "../../portfolioService";
import { useToast } from "@/components/ui/use-toast";
import { getAuthenticatedUser, notifyTransaction, logTransaction } from "./transactionUtils";
import { seedInitialTransactions as seedTransactions } from "./seedTransactions";

/**
 * Hook for managing transactions
 * @returns Object with transaction state and operations
 */
export const useTransactions = () => {
  console.log("Initializing useTransactions hook");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Function to load transactions from Supabase
  const loadTransactions = async () => {
    try {
      console.log("Starting to load transactions");
      setIsLoading(true);
      
      // Check if user is authenticated
      const user = await getAuthenticatedUser();
      
      if (!user) {
        logTransaction("No authenticated user, not loading transactions");
        setTransactions([]);
        setIsLoading(false);
        return;
      }
      
      logTransaction("Fetching transactions for user:", null, user.id);
      const data = await fetchTransactions();
      logTransaction("Transactions received from Supabase:", data);
      
      if (data && data.length > 0) {
        setTransactions(data);
      } else {
        logTransaction("No transactions found for this user");
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      notifyTransaction(toast, false, "loading");
      setTransactions([]);
    } finally {
      setIsLoading(false);
      console.log("Finished loading transactions");
    }
  };

  // Fetch transactions from Supabase on component mount
  useEffect(() => {
    console.log("useTransactions effect running");
    loadTransactions();
  }, [toast]);

  // Add transaction to history and save to Supabase
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
      logTransaction("Saving transaction to Supabase:", transaction);
      
      // First save to Supabase to ensure it gets stored in the database
      const savedTransaction = await saveTransaction(transaction);
      logTransaction("Transaction saved to Supabase with id:", savedTransaction.id);
      
      // Update local state with the transaction returned from Supabase
      setTransactions(prev => [savedTransaction, ...prev]);
      
      notifyTransaction(toast, true);
      
      return savedTransaction;
    } catch (error) {
      console.error('Error in addTransaction:', error);
      notifyTransaction(toast, false);
      throw error;
    }
  };

  // Helper function to seed initial transactions to Supabase (only for development)
  const seedInitialTransactions = async () => {
    await seedTransactions(toast, loadTransactions);
  };

  console.log("Returning useTransactions hook data");
  return {
    transactions,
    isLoading,
    addTransaction,
    loadTransactions, // Export loadTransactions for manual refresh
    seedInitialTransactions
  };
};
