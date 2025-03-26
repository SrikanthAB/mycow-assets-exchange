
import { useState, useEffect, useCallback, useRef } from "react";
import { Transaction } from "../../types";
import { fetchTransactions, saveTransaction } from "../../portfolioService";
import { useToast } from "@/components/ui/use-toast";
import { getAuthenticatedUser, notifyTransaction, logTransaction } from "./transactionUtils";
import { seedInitialTransactions as seedTransactions } from "./seedTransactions";
import { supabase } from "@/integrations/supabase/client";

export const useTransactions = () => {
  console.log("Initializing useTransactions hook");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  const isLoadingRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  const loadTransactions = useCallback(async () => {
    if (isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      console.log("Starting to load transactions");
      setIsLoading(true);
      
      const user = await getAuthenticatedUser();
      
      if (!user) {
        logTransaction("No authenticated user, not loading transactions");
        setTransactions([]); 
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
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed in useTransactions:", event);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (userIdRef.current !== session?.user.id) {
            await loadTransactions();
          }
        } else if (event === 'SIGNED_OUT') {
          userIdRef.current = null;
          setTransactions([]); 
        }
      }
    );
    
    // Initial load
    loadTransactions();
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [loadTransactions]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
      logTransaction("Saving transaction to Supabase:", transaction);
      
      const user = await getAuthenticatedUser();
      if (!user) {
        const error = new Error("User must be authenticated to save transactions");
        console.error(error);
        notifyTransaction(toast, false);
        throw error;
      }
      
      const savedTransaction = await saveTransaction(transaction);
      logTransaction("Transaction saved to Supabase with id:", savedTransaction.id);
      
      // Update transactions state with the new transaction
      setTransactions(prev => [savedTransaction, ...prev]);
      
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
    loadTransactions, 
    seedInitialTransactions
  };
};
