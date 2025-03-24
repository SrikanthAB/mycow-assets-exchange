
import React from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RefreshButtonProps {
  isRefreshing: boolean;
  onClick: () => Promise<void>;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ isRefreshing, onClick }) => {
  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2"
      onClick={onClick}
      disabled={isRefreshing}
    >
      {isRefreshing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      Refresh
    </Button>
  );
};

export default RefreshButton;
