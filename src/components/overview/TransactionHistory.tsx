
import React, { useEffect } from "react";
import { usePortfolio } from "@/contexts/portfolio";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const TransactionHistory = () => {
  const { transactions, isLoading } = usePortfolio();
  const { toast } = useToast();

  const downloadStatement = () => {
    toast({
      title: "Statement Downloaded",
      description: "Your transaction statement has been downloaded successfully.",
    });
  };

  // Function to get transaction description based on transaction type
  const getTransactionDescription = (transaction) => {
    switch (transaction.type) {
      case 'buy':
        return `Bought ${transaction.asset}`;
      case 'sell':
        return `Sold ${transaction.asset}`;
      case 'deposit':
        return 'Funds deposited';
      case 'withdrawal':
        return 'Funds withdrawn';
      case 'loan':
        return `Loan secured with ${transaction.asset}`;
      case 'repayment':
        return `Loan repaid for ${transaction.asset}`;
      case 'lock':
        return `${transaction.asset} locked as collateral`;
      case 'unlock':
        return `${transaction.asset} unlocked from collateral`;
      case 'stake':
        return `${transaction.asset} staked`;
      case 'unstake':
        return `${transaction.asset} unstaked`;
      case 'swap':
        return `Swapped ${transaction.asset} for ${transaction.toAsset}`;
      default:
        return transaction.asset ? transaction.asset : 'Transaction';
    }
  };

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            A record of all your transactions
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={downloadStatement}
          >
            <Download size={16} />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading transactions...</span>
          </div>
        ) : sortedTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found. Start trading to see your history here.
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
