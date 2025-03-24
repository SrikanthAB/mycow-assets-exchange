
import { useState, useEffect, useCallback, useRef } from "react";
import { Transaction } from "../../types";
import { fetchTransactions, saveTransaction } from "../../portfolioService";
import { useToast } from "@/components/ui/use-toast";
import { getAuthenticatedUser, notifyTransaction, logTransaction } from "./transactionUtils";
import { seedInitialTransactions as seedTransactions } from "./seedTransactions";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for managing transactions with optimized loading and caching
 * @returns Object with transaction state and operations
 */
export const useTransactions = () => {
  console.log("Initializing useTransactions hook");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Use refs to prevent duplicate loading
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  // Function to load transactions from Supabase with caching
  const loadTransactions = useCallback(async () => {
    // Prevent duplicate loading requests
    if (isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      console.log("Starting to load transactions");
      setIsLoading(true);
      
      // Check if user is authenticated
      const user = await getAuthenticatedUser();
      
      if (!user) {
        logTransaction("No authenticated user, not loading transactions");
        setTransactions([]);
        setIsLoading(false);
        isLoadingRef.current = false;
        return;
      }
      
      // If we already loaded for this user, no need to reload
      if (hasLoadedRef.current && userIdRef.current === user.id) {
        setIsLoading(false);
        isLoadingRef.current = false;
        return;
      }
      
      userIdRef.current = user.id;
      
      logTransaction("Fetching transactions for user:", null, user.id);
      const data = await fetchTransactions();
      logTransaction("Transactions received from Supabase:", data);
      
      if (data && data.length > 0) {
        setTransactions(data);
      } else {
        logTransaction("No transactions found for this user");
        setTransactions([]);
      }
      
      hasLoadedRef.current = true;
    } catch (error) {
      console.error('Error loading transactions:', error);
      notifyTransaction(toast, false, "loading");
      setTransactions([]);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
      console.log("Finished loading transactions");
    }
  }, [toast]);

  // Fetch transactions from Supabase on component mount and when user changes
  useEffect(() => {
    console.log("useTransactions effect running");
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed in useTransactions:", event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Reset cache if user changed
        if (userIdRef.current !== session?.user.id) {
          hasLoadedRef.current = false;
        }
        await loadTransactions();
      } else if (event === 'SIGNED_OUT') {
        userIdRef.current = null;
        hasLoadedRef.current = false;
        setTransactions([]);
      }
    });
    
    // Initial load
    loadTransactions();
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [loadTransactions]);

  // Add transaction to history and save to Supabase with optimistic updates
  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
      logTransaction("Saving transaction to Supabase:", transaction);
      
      // Check if user is authenticated
      const user = await getAuthenticatedUser();
      if (!user) {
        const error = new Error("User must be authenticated to save transactions");
        console.error(error);
        notifyTransaction(toast, false);
        throw error;
      }
      
      // Create a temporary ID and date for optimistic update
      const tempId = `temp-${Date.now()}`;
      const tempDate = new Date().toISOString();
      
      // Optimistically update UI before the API call
      const optimisticTransaction: Transaction = {
        id: tempId,
        date: tempDate,
        ...transaction
      };
      
      setTransactions(prev => [optimisticTransaction, ...prev]);
      
      // Save to Supabase
      const savedTransaction = await saveTransaction(transaction);
      logTransaction("Transaction saved to Supabase with id:", savedTransaction.id);
      
      // Replace optimistic transaction with real one
      setTransactions(prev => 
        prev.map(t => t.id === tempId ? savedTransaction : t)
      );
      
      notifyTransaction(toast, true);
      
      return savedTransaction;
    } catch (error) {
      console.error('Error in addTransaction:', error);
      notifyTransaction(toast, false);
      throw error;
    }
  }, [toast]);

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
