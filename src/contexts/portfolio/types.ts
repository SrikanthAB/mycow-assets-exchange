
// Define token types
export interface Token {
  id: string;
  name: string;
  symbol: string;
  category: string;
  price: number;
  priceString: string;
  change: number;
  balance: number;
  image?: string;
  yield?: string;
}

// Define transaction interface
export interface Transaction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal';
  asset?: string;
  amount: number;
  value: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface PortfolioContextType {
  tokens: Token[];
  walletBalance: number;
  transactions: Transaction[];
  addToken: (token: Token) => void;
  removeToken: (id: string) => void;
  updateTokenBalance: (id: string, amount: number) => void;
  getTotalPortfolioValue: () => number;
  addFunds: (amount: number) => void;
  deductFunds: (amount: number) => boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  isLoading: boolean;
}
