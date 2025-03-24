
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import TransactionHeader from "./TransactionHeader";
import TransactionTable from "./TransactionTable";
import { useTransactionHistory } from "./useTransactionHistory";

/**
 * TransactionHistory Component
 * 
 * This component displays the user's transaction history and provides
 * functionality to refresh and download the transaction records.
 */
const TransactionHistory = () => {
  const {
    transactions,
    isLoading,
    isRefreshing,
    handleRefresh,
    downloadStatement,
    hasTransactions
  } = useTransactionHistory();

  return (
    <Card>
      <TransactionHeader
        isRefreshing={isRefreshing}
        handleRefresh={handleRefresh}
        downloadStatement={downloadStatement}
        hasTransactions={hasTransactions}
      />
      <CardContent>
        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
