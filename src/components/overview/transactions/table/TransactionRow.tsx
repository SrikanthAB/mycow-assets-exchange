
import React from "react";
import { Transaction } from "@/contexts/portfolio/types";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getTransactionDescription } from "../transactionUtils";

interface TransactionRowProps {
  transaction: Transaction;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  return (
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
  );
};

export default TransactionRow;
