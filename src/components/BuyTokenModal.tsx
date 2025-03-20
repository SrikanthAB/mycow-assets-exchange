
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { usePortfolio } from "@/contexts/PortfolioContext";

interface BuyTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: {
    id: string;
    name: string;
    symbol: string;
    price: string;
    numericPrice: number;
    category: string;
    yield?: string; // Make yield optional
  };
}

const BuyTokenModal = ({ isOpen, onClose, asset }: BuyTokenModalProps) => {
  const [amount, setAmount] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [upiId, setUpiId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();
  const { addToken, tokens, updateTokenBalance } = usePortfolio();
  
  const totalCost = amount * asset.numericPrice;
  
  const handlePurchase = () => {
    if (!amount || amount <= 0 || !upiId) return;
    
    setIsProcessing(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      // Check if token already exists in portfolio
      const existingToken = tokens.find(t => t.id === asset.id);
      
      if (existingToken) {
        // Update existing token balance
        updateTokenBalance(asset.id, amount);
      } else {
        // Add new token to portfolio
        addToken({
          id: asset.id,
          name: asset.name,
          symbol: asset.symbol,
          category: asset.category,
          price: asset.numericPrice,
          priceString: asset.price,
          change: 0, // Default change value
          balance: amount,
          yield: asset.yield // Now this is properly typed as optional
        });
      }
      
      // Show success message
      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${amount} ${asset.symbol} tokens.`,
      });
      
      // Reset form and close modal
      setAmount(1);
      setUpiId("");
      setIsProcessing(false);
      onClose();
    }, 2000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy {asset.name}</DialogTitle>
          <DialogDescription>
            Purchase {asset.symbol} tokens using UPI payment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Token Price</label>
            <div className="p-3 bg-muted rounded-md">{asset.price}</div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">
              Amount to Buy
            </label>
            <Input
              type="number"
              min={0.1}
              step={0.1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          
          <div className="p-3 bg-muted/30 rounded-md">
            <div className="flex justify-between">
              <span>Total Cost</span>
              <span className="font-medium">₹{totalCost.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Payment Method</label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="upi">UPI</option>
              <option value="netbanking" disabled>Net Banking</option>
              <option value="card" disabled>Credit/Debit Card</option>
            </select>
          </div>
          
          {paymentMethod === "upi" && (
            <div>
              <label className="text-sm font-medium mb-2 block">UPI ID</label>
              <Input
                placeholder="name@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handlePurchase} 
            disabled={!amount || amount <= 0 || !upiId || isProcessing}
            className={isProcessing ? "opacity-80" : ""}
          >
            {isProcessing ? "Processing..." : "Buy Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyTokenModal;
