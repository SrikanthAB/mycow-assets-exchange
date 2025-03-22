
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PieChart, HistoryIcon, WalletIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ui/theme-provider";

// Import the component files
import PortfolioSection from "@/components/overview/PortfolioSection";
import WalletSection from "@/components/overview/WalletSection";
import TransactionHistory from "@/components/overview/TransactionHistory";

const Overview = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
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
              <TabsList className={`grid w-full grid-cols-3 mb-8 ${theme === 'dark' ? 'bg-[#1e293b] border border-blue-900/30' : ''}`}>
                <TabsTrigger 
                  value="portfolio" 
                  className={`flex items-center gap-2 ${theme === 'dark' ? 'data-[state=active]:bg-[#0f172a] data-[state=active]:text-white hover:bg-[#0f172a]/80' : ''}`}
                >
                  <PieChart size={16} />
                  <span>Portfolio</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="wallet" 
                  className={`flex items-center gap-2 ${theme === 'dark' ? 'data-[state=active]:bg-[#0f172a] data-[state=active]:text-white hover:bg-[#0f172a]/80' : ''}`}
                >
                  <WalletIcon size={16} />
                  <span>Wallet</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className={`flex items-center gap-2 ${theme === 'dark' ? 'data-[state=active]:bg-[#0f172a] data-[state=active]:text-white hover:bg-[#0f172a]/80' : ''}`}
                >
                  <HistoryIcon size={16} />
                  <span>History</span>
                </TabsTrigger>
              </TabsList>

              {/* Portfolio Section */}
              <TabsContent value="portfolio" className="space-y-6">
                <PortfolioSection />
              </TabsContent>

              {/* Wallet Section */}
              <TabsContent value="wallet" className="space-y-6">
                <WalletSection />
              </TabsContent>

              {/* History Section */}
              <TabsContent value="history" className="space-y-6">
                <TransactionHistory />
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
