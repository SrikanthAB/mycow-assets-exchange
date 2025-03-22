
import { ArrowDown } from "lucide-react";

interface TokenSwitcherProps {
  onSwitch: () => void;
}

const TokenSwitcher = ({ onSwitch }: TokenSwitcherProps) => {
  return (
    <button 
      onClick={onSwitch}
      className="bg-primary/20 hover:bg-primary/30 w-10 h-10 rounded-full flex items-center justify-center mx-auto my-2 shadow-md border border-primary/10 transition-all duration-300"
    >
      <ArrowDown className="w-5 h-5 text-primary" />
    </button>
  );
};

export default TokenSwitcher;
