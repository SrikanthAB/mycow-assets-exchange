import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { TrendingUp, TrendingDown, Download, History as HistoryIcon, Wallet as WalletIcon, PieChart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

const Overview = () => {
  const { tokens, walletBalance, getTotalPortfolioValue, transactions, isLoading } = usePortfolio();
  const totalValue = getTotalPortfolioValue();
  const { toast } = useToast();
  
  const downloadStatement = () => {
    toast({
      title: "Statement Downloaded",
      description: "Your transaction statement has been downloaded successfully.",
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <h1 className="text-3xl font-bold">Overview</h1>
              <p className="mt-3 text-muted-foreground">
                Manage your assets, wallet, and transaction history in one place.
              </p>
            </div>
            
            <Tabs defaultValue="portfolio" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="portfolio" className="flex items-center gap-2">
                  <PieChart size={16} />
                  <span>Portfolio</span>
                </TabsTrigger>
                <TabsTrigger value="wallet" className="flex items-center gap-2">
                  <WalletIcon size={16} />
                  <span>Wallet</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <HistoryIcon size={16} />
                  <span>History</span>
                </TabsTrigger>
              </TabsList>

              {/* Portfolio Section */}
              <TabsContent value="portfolio" className="space-y-6">
                <div className="bg-muted/30 rounded-xl p-6 mb-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between">
                    <div>
                      <h3 className="text-muted-foreground text-sm font-medium">Total Portfolio Value</h3>
                      <div className="text-3xl font-bold mt-1">₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Button variant="outline">Export Report</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Your Assets</h3>
                  
                  {tokens.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">You don't have any assets yet.</p>
                      <Button className="mt-4">Browse Markets</Button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {tokens.map(token => {
                        const isPositiveChange = token.change >= 0;
                        const tokenValue = token.price * token.balance;
                        
                        return (
                          <div key={token.id} className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center overflow-hidden">
                                  {token.image ? (
                                    <img src={token.image} alt={token.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                                      {token.symbol.substring(0, 2)}
                                    </div>
                                  )}
                                </div>
                                <div className="ml-3">
                                  <h4 className="font-medium">{token.name}</h4>
                                  <div className="text-xs text-muted-foreground flex items-center">
                                    <span className="bg-secondary px-1.5 py-0.5 rounded text-xs mr-2">{token.category}</span>
                                    <span>{token.symbol}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-sm font-medium">Balance</div>
                                <div>{token.balance.toLocaleString('en-IN', { maximumFractionDigits: 4 })} {token.symbol}</div>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Current Value</div>
                                <div className="text-xl font-semibold">₹{tokenValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                                <div 
                                  className={cn(
                                    "flex items-center text-sm",
                                    isPositiveChange ? "text-green-600" : "text-red-500"
                                  )}
                                >
                                  {isPositiveChange ? (
                                    <TrendingUp size={14} className="mr-1" />
                                  ) : (
                                    <TrendingDown size={14} className="mr-1" />
                                  )}
                                  {isPositiveChange ? "+" : ""}{token.change}%
                                </div>
                              </div>
                              
                              {token.yield && (
                                <div className="text-right">
                                  <div className="text-sm text-muted-foreground">Estimated Yield</div>
                                  <div className="font-medium text-green-600">{token.yield}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Wallet Section */}
              <TabsContent value="wallet" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Wallet</CardTitle>
                    <CardDescription>
                      Manage your funds and add money to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="bg-muted/30 rounded-xl p-6">
                        <h3 className="text-muted-foreground text-sm font-medium">Available Balance</h3>
                        <div className="text-3xl font-bold mt-1">₹{walletBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button className="flex-1">
                          Add Funds
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Withdraw
                        </Button>
                      </div>
                      
                      <div className="bg-muted/30 rounded-xl p-6">
                        <h3 className="font-medium mb-4">Quick Stats</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <div className="text-muted-foreground text-sm">Total Portfolio</div>
                            <div className="font-medium">₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-sm">Total Assets</div>
                            <div className="font-medium">{tokens.length}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Section */}
              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Transaction History</CardTitle>
                      <CardDescription>
                        A record of all your transactions
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={downloadStatement}
                    >
                      <Download size={16} />
                      Download Statement
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">Loading transactions...</span>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No transactions found. Start trading to see your history here.
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>
                                {new Date(transaction.date).toLocaleDateString('en-IN')}
                              </TableCell>
                              <TableCell className="capitalize">{transaction.type}</TableCell>
                              <TableCell>
                                {transaction.asset ? transaction.asset : 
                                  transaction.type === 'deposit' ? 'Added funds' : 'Withdrawn funds'}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ₹{transaction.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell>
                                <div className={cn(
                                  "px-2 py-1 rounded-full text-xs inline-block capitalize font-medium",
                                  transaction.status === 'completed' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                  transaction.status === 'pending' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                )}>
                                  {transaction.status}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Overview;
