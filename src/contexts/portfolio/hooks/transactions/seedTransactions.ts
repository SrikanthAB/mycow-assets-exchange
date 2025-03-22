
import { Transaction } from "../../types";
import { saveTransaction } from "../../portfolioService";
import { getAuthenticatedUser, notifyTransaction, logTransaction } from "./transactionUtils";
import { useToast } from "@/components/ui/use-toast";

/**
 * Seed initial transactions for development purposes
 * @param toast Toast function from useToast
 * @param refreshTransactions Function to refresh transactions after seeding
 * @returns Promise that resolves when seeding is complete
 */
export const seedInitialTransactions = async (
  toast: ReturnType<typeof useToast>["toast"],
  refreshTransactions: () => Promise<void>
) => {
  try {
    // Check if user is authenticated
    const user = await getAuthenticatedUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to seed transactions.",
        variant: "destructive"
      });
      return;
    }

    // Create initial transactions to seed
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
    
    logTransaction("Seeded initial transactions to Supabase for user:", null, user.id);
    
    // Reload transactions from Supabase
    await refreshTransactions();
    
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
