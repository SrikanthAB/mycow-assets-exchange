
import { ArrowDown } from "lucide-react";

interface TokenSwitcherProps {
  onSwitch: () => void;
}

const TokenSwitcher = ({ onSwitch }: TokenSwitcherProps) => {
  return (
    <button 
      onClick={onSwitch}
      className="bg-muted/50 hover:bg-muted w-10 h-10 rounded-full flex items-center justify-center mx-auto my-2"
    >
      <ArrowDown className="w-5 h-5" />
    </button>
  );
};

export default TokenSwitcher;
