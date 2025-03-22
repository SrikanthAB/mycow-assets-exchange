
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const AssetDetailsFooter = () => {
  return (
    <>
      <div className="flex justify-end">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Download Documentation</span>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Note: This information is provided for educational purposes only and should not be considered investment advice.
        Always conduct your own research before making investment decisions.
      </p>
    </>
  );
};

export default AssetDetailsFooter;
