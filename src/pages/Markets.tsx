
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AssetCard from "@/components/AssetCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BuyTokenModal from "@/components/BuyTokenModal";
import { usePortfolio, Token } from "@/contexts/portfolio";

// Mock data for asset listings
const marketAssets = [
  {
    id: "1",
    name: "Embassy REIT",
    symbol: "EMREIT",
    image: "",
    price: "₹356.42",
    change: 2.34,
    category: "Real Estate",
    yield: "8.5% APY",
    numericPrice: 356.42
  },
  {
    id: "2",
    name: "Digital Gold",
    symbol: "DGOLD",
    image: "",
    price: "₹7,245.30",
    change: 0.87,
    category: "Commodity",
    yield: "0.5% APY",
    numericPrice: 7245.30
  },
  {
    id: "3",
    name: "Movie Fund I",
    symbol: "MF01",
    image: "",
    price: "₹115.67",
    change: 12.43,
    category: "Entertainment",
    yield: "14.2% APY",
    numericPrice: 115.67
  },
  {
    id: "4",
    name: "Credit Fund",
    symbol: "CRED",
    image: "",
    price: "₹1,043.21",
    change: -1.05,
    category: "Private Credit",
    yield: "11.3% APY",
    numericPrice: 1043.21
  },
  {
    id: "5",
    name: "Gold Stablecoin",
    symbol: "XAUT",
    image: "",
    price: "₹7,249.12",
    change: 0.21,
    category: "Stablecoin",
    yield: "2.1% APY",
    numericPrice: 7249.12
  },
  {
    id: "6",
    name: "MyCow Token",
    symbol: "MCT",
    image: "",
    price: "₹24.37",
    change: 5.63,
    category: "Native Token",
    yield: "7.8% APY",
    numericPrice: 24.37
  },
  {
    id: "7",
    name: "Prestige Office",
    symbol: "POFF",
    image: "",
    price: "₹512.90",
    change: 1.45,
    category: "Real Estate",
    yield: "9.2% APY",
    numericPrice: 512.90
  },
  {
    id: "8",
    name: "OTT Series Fund",
    symbol: "OTSF",
    image: "",
    price: "₹87.42",
    change: -2.31,
    category: "Entertainment",
    yield: "16.5% APY",
    numericPrice: 87.42
  }
];

const categories = [
  "All Assets",
  "Real Estate",
  "Commodity",
  "Entertainment",
  "Private Credit",
  "Stablecoin",
  "Native Token"
];

const Markets = () => {
  const [activeCategory, setActiveCategory] = useState("All Assets");
  const [selectedAsset, setSelectedAsset] = useState<null | any>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  
  const filteredAssets = activeCategory === "All Assets" 
    ? marketAssets 
    : marketAssets.filter(asset => asset.category === activeCategory);
  
  const handleBuy = (asset: any) => {
    // Ensure the asset includes the yield property when passed to BuyTokenModal
    const assetWithYield = {
      ...asset,
      yield: asset.yield // Make sure yield is explicitly passed
    };
    setSelectedAsset(assetWithYield);
    setIsBuyModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="py-8 md:py-12 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <h2 className="animate-slide-up">Explore Token Markets</h2>
                <p className="mt-3 text-muted-foreground max-w-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  Discover a diverse range of tokenized real-world assets with transparent pricing and attractive yields.
                </p>
              </div>
            </div>
            
            <Tabs defaultValue="All Assets" className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="mb-8 border-b border-border overflow-x-auto pb-1">
                <TabsList className="bg-transparent h-auto p-0 space-x-6">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="px-1 py-2 text-base data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <TabsContent value={activeCategory} className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAssets.map(asset => (
                    <AssetCard 
                      key={asset.id}
                      name={asset.name}
                      symbol={asset.symbol}
                      image={asset.image}
                      price={asset.price}
                      change={asset.change}
                      category={asset.category}
                      yield={asset.yield}
                      onBuy={() => handleBuy(asset)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      {selectedAsset && (
        <BuyTokenModal 
          isOpen={isBuyModalOpen} 
          onClose={() => setIsBuyModalOpen(false)} 
          asset={selectedAsset}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Markets;
