
import { Token } from "@/contexts/portfolio";
import SwapForm from "./SwapForm";

interface SwapSectionProps {
  tokens: Token[];
}

const SwapSection = ({ tokens }: SwapSectionProps) => {
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
          <SwapForm tokens={tokens} />
        </div>
      </div>
    </section>
  );
};

export default SwapSection;
