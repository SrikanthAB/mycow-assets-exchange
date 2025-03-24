
import { useState, useEffect } from "react";
import { usePortfolio } from "@/contexts/portfolio";
import { useToast } from "@/components/ui/use-toast";
import { prepareTransactionStatement } from "./transactionUtils";

export const useTransactionHistory = () => {
  const { transactions, isLoading, loadTransactions } = usePortfolio();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  // Function to refresh the transaction list
  const handleRefresh = async () => {
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
  };

  useEffect(() => {
    console.log("Loaded transactions:", transactions?.length || 0);
  }, [transactions]);

  const downloadStatement = () => {
    prepareTransactionStatement(transactions, toast);
  };

  return {
    transactions: transactions || [],
    isLoading,
    isRefreshing,
    handleRefresh,
    downloadStatement,
    hasTransactions: transactions?.length > 0
  };
};
