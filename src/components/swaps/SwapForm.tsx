
import { Token } from "@/contexts/portfolio";
import TokenSelector from "./TokenSelector";
import RateDisplay from "./RateDisplay";
import SwapInputField from "./SwapInputField";
import TokenSwitcher from "./TokenSwitcher";
import SwapButton from "./SwapButton";
import { useSwapForm } from "@/hooks/useSwapForm";
import { useTheme } from "@/components/ui/theme-provider";

interface SwapFormProps {
  tokens: Token[];
}

const SwapForm = ({ tokens }: SwapFormProps) => {
  const { theme } = useTheme();
  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    exchangeRate,
    isSwapping,
    handleFromTokenChange,
    handleToTokenChange,
    handleFromAmountChange,
    handleSwap,
    switchTokens,
    refreshRate
  } = useSwapForm(tokens);
  
  return (
    <div className={`${theme === 'dark' ? 'bg-[#0f172a] border border-blue-900/30' : 'bg-white border border-gray-200'} rounded-xl shadow-sm p-6`}>
      <div className="mb-6">
        <TokenSelector 
          tokens={tokens}
          selectedToken={fromToken}
          onChange={handleFromTokenChange}
          label="From"
        />
        
        <SwapInputField
          amount={fromAmount}
          onChange={handleFromAmountChange}
          token={fromToken}
          onTokenChange={handleFromTokenChange}
          tokens={tokens}
        />
        
        <TokenSwitcher onSwitch={switchTokens} />
        
        <TokenSelector 
          tokens={tokens}
          selectedToken={toToken}
          onChange={handleToTokenChange}
          label="To"
        />
        
        <SwapInputField
          amount={toAmount ? toAmount.toFixed(4) : ""}
          token={toToken}
          onTokenChange={handleToTokenChange}
          tokens={tokens}
          readOnly={true}
        />
      </div>
      
      {fromToken && toToken && (
        <RateDisplay 
          fromToken={fromToken}
          toToken={toToken}
          exchangeRate={exchangeRate}
          onRefresh={refreshRate}
        />
      )}
      
      <SwapButton
        fromToken={fromToken}
        toToken={toToken}
        fromAmount={fromAmount}
        isSwapping={isSwapping}
        onClick={handleSwap}
      />
    </div>
  );
};

export default SwapForm;
