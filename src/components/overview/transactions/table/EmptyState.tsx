
import React from "react";

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      No transactions found. Start trading to see your history here.
    </div>
  );
};

export default EmptyState;
