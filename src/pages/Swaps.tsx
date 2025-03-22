
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePortfolio } from "@/contexts/portfolio";
import SwapSection from "@/components/swaps/SwapSection";

const Swaps = () => {
  const { tokens } = usePortfolio();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <SwapSection tokens={tokens} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Swaps;
