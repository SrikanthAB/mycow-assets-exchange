
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePortfolio } from "@/contexts/portfolio/usePortfolio";
import SwapSection from "@/components/swaps/SwapSection";
import { useTheme } from "@/components/ui/theme-provider";

const Swaps = () => {
  const { tokens } = usePortfolio();
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <SwapSection tokens={tokens} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Swaps;
