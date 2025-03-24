
import React from "react";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RefreshButton from "./buttons/RefreshButton";
import DownloadButton from "./buttons/DownloadButton";

interface TransactionHeaderProps {
  isRefreshing: boolean;
  handleRefresh: () => Promise<void>;
  downloadStatement: () => void;
  hasTransactions: boolean;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  isRefreshing,
  handleRefresh,
  downloadStatement,
  hasTransactions,
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0">
      <div>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          A record of all your transactions
        </CardDescription>
      </div>
      <div className="flex gap-2">
        <RefreshButton 
          isRefreshing={isRefreshing} 
          onClick={handleRefresh} 
        />
        <DownloadButton 
          onClick={downloadStatement}
          disabled={!hasTransactions}
        />
      </div>
    </CardHeader>
  );
};

export default TransactionHeader;
