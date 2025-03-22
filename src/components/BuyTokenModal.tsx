import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wallet, CreditCard, Smartphone } from "lucide-react";

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
    yield?: string;
  };
}

const BuyTokenModal = ({ isOpen, onClose, asset }: BuyTokenModalProps) => {
  const [amount, setAmount] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("wallet");
  const [upiId, setUpiId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();
  const { addToken, tokens, updateTokenBalance, walletBalance, deductFunds, addTransaction } = usePortfolio();
  
  const totalCost = amount * asset.numericPrice;
  const isWalletSufficient = walletBalance >= totalCost;
  
  const handlePurchase = () => {
    if (!amount || amount <= 0) return;
    
    // If using wallet, check if there are sufficient funds
    if (paymentMethod === "wallet" && !isWalletSufficient) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough funds in your wallet for this purchase.",
        variant: "destructive"
      });
      return;
    }
    
    // If using UPI, check if UPI ID is provided
    if (paymentMethod === "upi" && !upiId) {
      toast({
        title: "UPI ID required",
        description: "Please enter your UPI ID to proceed with the payment.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      // If using wallet, deduct funds
      if (paymentMethod === "wallet") {
        deductFunds(totalCost);
      }
      
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
          yield: asset.yield
        });
      }
      
      // Add transaction to history
      addTransaction({
        type: 'buy',
        asset: asset.name,
        amount: amount,
        value: totalCost,
        status: 'completed'
      });
      
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
            Purchase {asset.symbol} tokens using your preferred payment method.
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
            <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="wallet" className="flex items-center gap-1">
                  <Wallet className="h-4 w-4" />
                  Wallet
                </TabsTrigger>
                <TabsTrigger value="upi" className="flex items-center gap-1">
                  <Smartphone className="h-4 w-4" />
                  UPI
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  Card
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="wallet" className="mt-4">
                <div className="p-3 bg-muted/30 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span>Wallet Balance</span>
                    <span className="font-medium">₹{walletBalance.toLocaleString('en-IN')}</span>
                  </div>
                  {!isWalletSufficient && (
                    <div className="text-red-500 text-sm mt-1">
                      Insufficient funds. Please add more funds to your wallet or use another payment method.
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="upi" className="mt-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium mb-2 block">UPI ID</label>
                  <Input
                    placeholder="name@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="card" className="mt-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Card Number</label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Expiry</label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">CVV</label>
                      <Input type="password" placeholder="123" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handlePurchase} 
            disabled={
              (paymentMethod === "wallet" && !isWalletSufficient) || 
              (paymentMethod === "upi" && !upiId) || 
              !amount || amount <= 0 || 
              isProcessing
            }
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
