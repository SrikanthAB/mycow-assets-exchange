
import { useState } from "react";
import { initialWalletBalance } from "../initialData";

export const useWallet = () => {
  const [walletBalance, setWalletBalance] = useState<number>(initialWalletBalance);

  // Add funds to wallet
  const addFunds = (amount: number) => {
    setWalletBalance(prev => prev + amount);
  };

  // Deduct funds from wallet, returns true if successful, false if insufficient funds
  const deductFunds = (amount: number) => {
    if (walletBalance >= amount) {
      setWalletBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  return {
    walletBalance,
    addFunds,
    deductFunds
  };
};
