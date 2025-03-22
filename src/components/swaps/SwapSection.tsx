
import { Token } from "@/contexts/portfolio";
import SwapForm from "./SwapForm";
import { useTheme } from "@/components/ui/theme-provider";

interface SwapSectionProps {
  tokens: Token[];
}

const SwapSection = ({ tokens }: SwapSectionProps) => {
  const { theme } = useTheme();
  
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2>Swap Tokens</h2>
          <p className="mt-3 text-muted-foreground">
            Exchange your tokens for other assets at competitive rates with minimal slippage.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className={`${theme === 'dark' ? 'bg-[#0f172a] border border-blue-900/30' : 'bg-white border'} rounded-xl shadow-sm p-6`}>
            <SwapForm tokens={tokens} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SwapSection;
