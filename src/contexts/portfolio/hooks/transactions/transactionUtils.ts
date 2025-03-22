
import { Transaction } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

/**
 * Check if the user is authenticated
 * @returns Promise with the user if authenticated, null otherwise
 */
export const getAuthenticatedUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Records a transaction in the toast notification system
 * @param toast Toast function from useToast
 * @param success Whether the transaction was successful
 * @param action The action being performed (e.g., "saving", "loading")
 */
export const notifyTransaction = (
  toast: ReturnType<typeof useToast>["toast"], 
  success: boolean, 
  action: "saving" | "loading" = "saving"
) => {
  if (success) {
    toast({
      title: action === "saving" ? "Transaction recorded" : "Transactions loaded",
      description: action === "saving" 
        ? "Your transaction has been successfully saved." 
        : "Your transaction history has been loaded.",
    });
  } else {
    toast({
      title: action === "saving" ? "Transaction failed" : "Error loading transactions",
      description: action === "saving"
        ? "There was a problem saving your transaction."
        : "There was a problem loading your transaction history.",
      variant: "destructive"
    });
  }
};

/**
 * Log transaction operations with user context
 * @param message Message to log
 * @param data Optional data to log
 * @param userId Optional user ID
 */
export const logTransaction = (
  message: string, 
  data?: any, 
  userId?: string
) => {
  if (userId) {
    console.log(`[User ${userId}] ${message}`, data ? data : '');
  } else {
    console.log(message, data ? data : '');
  }
};
