
import { useState, useEffect, useCallback } from "react";
import { usePortfolio } from "@/contexts/portfolio";
import { useToast } from "@/components/ui/use-toast";
import { prepareTransactionStatement } from "./transactionUtils";

export const useTransactionHistory = () => {
  const { transactions, isLoading, loadTransactions } = usePortfolio();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  // Debounce function to prevent multiple refreshes
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  
  // Debounced refresh function
  const debouncedRefresh = useCallback(
    debounce(async () => {
      setIsRefreshing(true);
      try {
        await loadTransactions();
        toast({
          title: "Refreshed",
          description: "Transaction history has been refreshed.",
        });
      } catch (error) {
        console.error("Error refreshing transactions:", error);
        toast({
          title: "Refresh Failed",
          description: "Could not refresh transaction history.",
          variant: "destructive"
        });
      } finally {
        setIsRefreshing(false);
      }
    }, 500),
    [loadTransactions, toast]
  );
  
  // Function to refresh the transaction list
  const handleRefresh = () => {
    if (!isRefreshing) {
      debouncedRefresh();
    }
  };

  useEffect(() => {
    console.log("Loaded transactions:", transactions?.length || 0);
  }, [transactions]);

  const downloadStatement = useCallback(() => {
    prepareTransactionStatement(transactions, toast);
  }, [transactions, toast]);

  return {
    transactions: transactions || [],
    isLoading,
    isRefreshing,
    handleRefresh,
    downloadStatement,
    hasTransactions: transactions?.length > 0
  };
};
