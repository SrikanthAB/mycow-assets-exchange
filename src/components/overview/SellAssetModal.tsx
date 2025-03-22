
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Token, usePortfolio } from "@/contexts/portfolio";

interface SellAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: Token | null;
}

const SellAssetModal = ({ isOpen, onClose, token }: SellAssetModalProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { updateTokenBalance, addFunds, addTransaction } = usePortfolio();

  if (!token) return null;

  // Calculate the sale value
  const saleValue = amount * token.price;
  
  // Maximum amount user can sell (available balance)
  const maxAmount = token.locked && token.lockedAmount 
    ? token.balance - token.lockedAmount 
    : token.balance;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : Math.min(value, maxAmount));
  };

  const handleSell = async () => {
    if (amount <= 0 || amount > maxAmount) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to sell.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Update token balance (reduce it)
      updateTokenBalance(token.id, -amount);
      
      // Add funds to wallet
      addFunds(saleValue);
      
      // Record transaction
      await addTransaction({
        type: 'sell',
        asset: token.name,
        amount: amount,
        value: saleValue,
        status: 'completed'
      });
      
      toast({
        title: "Asset sold successfully",
        description: `You have sold ${amount} ${token.symbol} for ₹${saleValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}.`,
      });
      
      // Close modal and reset state
      onClose();
      setAmount(0);
    } catch (error) {
      console.error("Error selling asset:", error);
      toast({
        title: "Error selling asset",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sell {token.name}</DialogTitle>
          <DialogDescription>
            Enter the amount of {token.symbol} you want to sell.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Available Balance:</span>
            <span className="font-medium">{maxAmount.toLocaleString('en-IN', { maximumFractionDigits: 4 })} {token.symbol}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={amount || ""}
              onChange={handleAmountChange}
              min="0"
              max={maxAmount}
              step="0.01"
              placeholder="Enter amount to sell"
              disabled={isProcessing}
            />
            <Button 
              variant="outline" 
              onClick={() => setAmount(maxAmount)}
              disabled={isProcessing}
              className="whitespace-nowrap"
            >
              Max
            </Button>
          </div>
          
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">You sell:</span>
              <span className="font-medium">{amount.toLocaleString('en-IN', { maximumFractionDigits: 4 })} {token.symbol}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">You receive:</span>
              <span className="font-semibold text-green-600">₹{saleValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleSell} 
            disabled={amount <= 0 || amount > maxAmount || isProcessing}
            className={isProcessing ? "opacity-80" : ""}
          >
            {isProcessing ? "Processing..." : "Sell Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SellAssetModal;
