
import React from "react";
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TransactionTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Date</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Details</TableHead>
        <TableHead className="text-right">Amount</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TransactionTableHeader;
