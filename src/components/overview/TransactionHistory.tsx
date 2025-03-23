
import React, { useEffect, useState } from "react";
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
    // Create CSV data from transactions
    if (!transactions || transactions.length === 0) {
      toast({
        title: "No Data Available",
        description: "There are no transactions to download.",
      });
      return;
    }
    
    // CSV header
    let csvContent = "Date,Type,Details,Amount,Status\n";
    
    // Add transaction data
    transactions.forEach(transaction => {
      const date = new Date(transaction.date).toLocaleDateString('en-IN');
      const type = transaction.type;
      const details = getTransactionDescription(transaction);
      const amount = transaction.value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
      const status = transaction.status;
      
      csvContent += `"${date}","${type}","${details}","₹${amount}","${status}"\n`;
    });
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "transaction_statement.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
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
  const sortedTransactions = transactions?.length > 0 
    ? [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

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
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={downloadStatement}
            disabled={transactions?.length === 0}
          >
            <Download size={16} />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || isRefreshing ? (
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
