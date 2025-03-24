
import React from "react";
import { Transaction } from "@/contexts/portfolio/types";
import { TableBody } from "@/components/ui/table";
import TransactionRow from "./TransactionRow";

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  // Sort transactions by date (newest first)
  const sortedTransactions = transactions?.length > 0 
    ? [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];
    
  return (
    <TableBody>
      {sortedTransactions.map((transaction) => (
        <TransactionRow key={transaction.id} transaction={transaction} />
      ))}
    </TableBody>
  );
};

export default TransactionsList;
