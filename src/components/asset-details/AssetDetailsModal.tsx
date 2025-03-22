
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import AssetDetailsContent from "./AssetDetailsContent";
import AssetDetailsFooter from "./AssetDetailsFooter";
import { getAssetDetails } from "./AssetDetailsUtils";

interface AssetDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: {
    id: string;
    name: string;
    symbol: string;
    category: string;
    price: string;
    change: number;
    yield?: string;
  };
}

const AssetDetailsModal = ({ open, onOpenChange, asset }: AssetDetailsModalProps) => {
  const details = getAssetDetails(asset);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            {asset.name} ({asset.symbol}) Details
          </DialogTitle>
          <DialogDescription>
            Comprehensive information about this tokenized {asset.category.toLowerCase()} asset
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <AssetDetailsContent category={asset.category} details={details} />
          <AssetDetailsFooter />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetDetailsModal;
