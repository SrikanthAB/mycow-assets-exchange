
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AssetCard from "./AssetCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Mock data for asset listings
const assets = [
  {
    id: 1,
    name: "Embassy REIT",
    symbol: "EMREIT",
    image: "",
    price: "₹356.42",
    change: 2.34,
    category: "Real Estate",
    yield: "8.5% APY"
  },
  {
    id: 2,
    name: "Digital Gold",
    symbol: "DGOLD",
    image: "",
    price: "₹7,245.30",
    change: 0.87,
    category: "Commodity",
    yield: "0.5% APY"
  },
  {
    id: 3,
    name: "Movie Fund I",
    symbol: "MF01",
    image: "",
    price: "₹115.67",
    change: 12.43,
    category: "Entertainment",
    yield: "14.2% APY"
  },
  {
    id: 4,
    name: "Credit Fund",
    symbol: "CRED",
    image: "",
    price: "₹1,043.21",
    change: -1.05,
    category: "Private Credit",
    yield: "11.3% APY"
  },
  {
    id: 5,
    name: "Gold Stablecoin",
    symbol: "XAUT",
    image: "",
    price: "₹7,249.12",
    change: 0.21,
    category: "Stablecoin",
    yield: "2.1% APY"
  },
  {
    id: 6,
    name: "MyCow Token",
    symbol: "MCT",
    image: "",
    price: "₹24.37",
    change: 5.63,
    category: "Native Token",
    yield: "7.8% APY"
  },
  {
    id: 7,
    name: "Prestige Office",
    symbol: "POFF",
    image: "",
    price: "₹512.90",
    change: 1.45,
    category: "Real Estate",
    yield: "9.2% APY"
  },
  {
    id: 8,
    name: "OTT Series Fund",
    symbol: "OTSF",
    image: "",
    price: "₹87.42",
    change: -2.31,
    category: "Entertainment",
    yield: "16.5% APY"
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

const MarketSection = () => {
  const [activeCategory, setActiveCategory] = useState("All Assets");
  
  const filteredAssets = activeCategory === "All Assets" 
    ? assets 
    : assets.filter(asset => asset.category === activeCategory);
  
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="animate-slide-up">Explore Token Markets</h2>
            <p className="mt-3 text-muted-foreground max-w-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Discover a diverse range of tokenized real-world assets with transparent pricing and attractive yields.
            </p>
          </div>
          <Button variant="ghost" className="mt-4 md:mt-0 self-start md:self-auto button-effect animate-slide-up" style={{ animationDelay: '0.2s' }}>
            View All Markets
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
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
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default MarketSection;
