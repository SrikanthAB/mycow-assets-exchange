
import React from "react";
import { Transaction } from "@/contexts/portfolio/types";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getTransactionDescription } from "./transactionUtils";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  isRefreshing: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading,
  isRefreshing,
}) => {
  // Sort transactions by date (newest first)
  const sortedTransactions = transactions?.length > 0 
    ? [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  if (isLoading || isRefreshing) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading transactions...</span>
      </div>
    );
  }

  if (sortedTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions found. Start trading to see your history here.
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[600px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString('en-IN')}
              </TableCell>
              <TableCell className="capitalize">{transaction.type}</TableCell>
              <TableCell>
                {getTransactionDescription(transaction)}
              </TableCell>
              <TableCell className="text-right font-medium">
                ₹{transaction.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell>
                <div className={cn(
                  "px-2 py-1 rounded-full text-xs inline-block capitalize font-medium",
                  transaction.status === 'completed' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                  transaction.status === 'pending' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                )}>
                  {transaction.status}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
