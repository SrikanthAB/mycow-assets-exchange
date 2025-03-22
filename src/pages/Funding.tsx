
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Landmark, Smartphone, ArrowRight } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";

const Funding = () => {
  const [amount, setAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();
  const { walletBalance, addFunds } = usePortfolio();

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

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      const numericAmount = parseFloat(amount);
      
      // Add funds to wallet
      addFunds(numericAmount);
      
      toast({
        title: "Funds added successfully",
        description: `₹${numericAmount.toLocaleString('en-IN')} has been added to your wallet.`,
      });
      
      setAmount("");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <h2>Fund Your Wallet</h2>
              <p className="mt-3 text-muted-foreground">
                Add funds to your MyCow Exchange wallet to start trading tokenized assets.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Current Balance Card */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Wallet Balance</CardTitle>
                  <CardDescription>
                    Available funds for trading
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹{walletBalance.toLocaleString('en-IN')}</div>
                </CardContent>
              </Card>
              
              {/* Add Funds Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Add Funds</CardTitle>
                  <CardDescription>
                    Choose your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upi">
                    <TabsList className="grid grid-cols-4 mb-6">
                      <TabsTrigger value="upi" className="flex items-center">
                        <Smartphone className="w-4 h-4 mr-2" />
                        UPI
                      </TabsTrigger>
                      <TabsTrigger value="netbanking" className="flex items-center">
                        <Landmark className="w-4 h-4 mr-2" />
                        Net Banking
                      </TabsTrigger>
                      <TabsTrigger value="credit" className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Credit Card
                      </TabsTrigger>
                      <TabsTrigger value="debit" className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Debit Card
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upi" className="space-y-4">
                      <div>
                        <Label htmlFor="upi-id">UPI ID</Label>
                        <Input id="upi-id" placeholder="yourname@upi" className="mt-1" />
                      </div>
                      
                      <div>
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input 
                          id="amount" 
                          type="number" 
                          min="100"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
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
                    </TabsContent>
                    
                    <TabsContent value="netbanking" className="space-y-4">
                      <div>
                        <Label>Select Bank</Label>
                        <RadioGroup defaultValue="hdfc" className="mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hdfc" id="hdfc" />
                            <Label htmlFor="hdfc">HDFC Bank</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sbi" id="sbi" />
                            <Label htmlFor="sbi">State Bank of India</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="icici" id="icici" />
                            <Label htmlFor="icici">ICICI Bank</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="axis" id="axis" />
                            <Label htmlFor="axis">Axis Bank</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <Label htmlFor="nb-amount">Amount (₹)</Label>
                        <Input 
                          id="nb-amount" 
                          type="number" 
                          min="100"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
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
                    </TabsContent>
                    
                    <TabsContent value="credit" className="space-y-4">
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" className="mt-1" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" type="password" placeholder="123" className="mt-1" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="cc-amount">Amount (₹)</Label>
                        <Input 
                          id="cc-amount" 
                          type="number" 
                          min="100"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
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
                    </TabsContent>
                    
                    <TabsContent value="debit" className="space-y-4">
                      <div>
                        <Label htmlFor="debit-number">Card Number</Label>
                        <Input id="debit-number" placeholder="1234 5678 9012 3456" className="mt-1" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="debit-expiry">Expiry Date</Label>
                          <Input id="debit-expiry" placeholder="MM/YY" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="debit-cvv">CVV</Label>
                          <Input id="debit-cvv" type="password" placeholder="123" className="mt-1" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="dc-amount">Amount (₹)</Label>
                        <Input 
                          id="dc-amount" 
                          type="number" 
                          min="100"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
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
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleAddFunds}
                    disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                    className="ml-auto"
                  >
                    {isProcessing ? "Processing..." : "Add Funds"}
                    {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Transaction History */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Recent wallet funding transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    No recent transactions to display.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Funding;
