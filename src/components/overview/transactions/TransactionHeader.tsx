
import React from "react";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

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
          disabled={!hasTransactions}
        >
          <Download size={16} />
          Download
        </Button>
      </div>
    </CardHeader>
  );
};

export default TransactionHeader;
