
import { Transaction } from "@/contexts/portfolio/types";
import { useToast } from "@/components/ui/use-toast";

/**
 * Function to get transaction description based on transaction type
 */
export const getTransactionDescription = (transaction: Transaction): string => {
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

/**
 * Function to prepare and download transaction statement as CSV
 */
export const prepareTransactionStatement = (
  transactions: Transaction[],
  toast: ReturnType<typeof useToast>["toast"]
): void => {
  // Check if there are transactions to download
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
