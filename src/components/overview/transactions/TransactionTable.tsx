
import React from "react";
import { Transaction } from "@/contexts/portfolio/types";
import { Table } from "@/components/ui/table";
import TransactionTableHeader from "./table/TransactionTableHeader";
import TransactionsList from "./table/TransactionsList";
import LoadingState from "./table/LoadingState";
import EmptyState from "./table/EmptyState";

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
  if (isLoading || isRefreshing) {
    return <LoadingState />;
  }

  if (transactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-auto max-h-[600px]">
      <Table>
        <TransactionTableHeader />
        <TransactionsList transactions={transactions} />
      </Table>
    </div>
  );
};

export default TransactionTable;
