
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { usePortfolio } from "@/contexts/portfolio";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wallet, CreditCard, Smartphone } from "lucide-react";

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFundsModal = ({ isOpen, onClose }: AddFundsModalProps) => {
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [upiId, setUpiId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();
  const { addFunds, addTransaction } = usePortfolio();
  
  // Predefined amounts
  const quickAmounts = [1000, 5000, 10000, 25000, 50000];
  
  const handleAddFunds = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to add to your wallet.",
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
      const numericAmount = parseFloat(amount);
      
      // Add funds to wallet
      addFunds(numericAmount);
      
      // Add transaction to history
      addTransaction({
        type: 'deposit',
        asset: 'INR',
        amount: numericAmount,
        value: numericAmount,
        status: 'completed'
      });
      
      // Show success message
      toast({
        title: "Funds added successfully",
        description: `₹${numericAmount.toLocaleString('en-IN')} has been added to your wallet.`,
      });
      
      // Reset form and close modal
      setAmount("");
      setUpiId("");
      setIsProcessing(false);
      onClose();
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Funds to Wallet</DialogTitle>
          <DialogDescription>
            Add money to your wallet using your preferred payment method.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Amount (₹)</label>
            <Input
              type="number"
              min={100}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mt-1">
            {quickAmounts.map((quickAmount) => (
              <Button 
                key={quickAmount}
                variant="outline" 
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
              >
                ₹{quickAmount.toLocaleString('en-IN')}
              </Button>
            ))}
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Payment Method</label>
            <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="upi" className="flex items-center gap-1">
                  <Smartphone className="h-4 w-4" />
                  UPI
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  Card
                </TabsTrigger>
                <TabsTrigger value="netbanking" className="flex items-center gap-1">
                  <Wallet className="h-4 w-4" />
                  Net Banking
                </TabsTrigger>
              </TabsList>
              
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
              
              <TabsContent value="netbanking" className="mt-4">
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-sm">Select your bank to proceed with net banking payment.</p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Button variant="outline" size="sm" className="justify-start">HDFC Bank</Button>
                    <Button variant="outline" size="sm" className="justify-start">SBI</Button>
                    <Button variant="outline" size="sm" className="justify-start">ICICI Bank</Button>
                    <Button variant="outline" size="sm" className="justify-start">Axis Bank</Button>
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
            onClick={handleAddFunds} 
            disabled={
              !amount || 
              parseFloat(amount) <= 0 || 
              (paymentMethod === "upi" && !upiId) || 
              isProcessing
            }
            className={isProcessing ? "opacity-80" : ""}
          >
            {isProcessing ? "Processing..." : "Add Funds"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFundsModal;
