
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
  locked?: boolean;
  lockedAmount?: number;
  loanId?: string;
  staked?: boolean;
}

// Define transaction interface
export interface Transaction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'lock' | 'unlock' | 'loan' | 'repayment' | 'stake' | 'unstake' | 'swap';
  asset?: string;
  amount: number;
  value: number;
  status: 'completed' | 'pending' | 'failed';
  toAsset?: string; // For swap transactions
}

// Define loan interface
export interface Loan {
  id: string;
  amount: number;
  collateralToken: string;
  collateralAmount: number;
  collateralValue: number;
  collateralRatio: number;
  interestRate: number;
  term: number;
  startDate: string;
  remainingDays: number;
  status: 'active' | 'repaid' | 'liquidated';
}

export interface PortfolioContextType {
  tokens: Token[];
  walletBalance: number;
  transactions: Transaction[];
  loans: Loan[];
  addToken: (token: Token) => void;
  removeToken: (id: string) => void;
  updateTokenBalance: (id: string, amount: number) => void;
  lockToken: (id: string, amount: number, loanId: string) => void;
  unlockToken: (id: string) => void;
  getTotalPortfolioValue: () => number;
  getAvailablePortfolioValue: () => number;
  addFunds: (amount: number) => void;
  deductFunds: (amount: number) => boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Promise<Transaction>;
  addLoan: (loan: Omit<Loan, 'id'>) => void;
  repayLoan: (id: string) => void;
  isLoading: boolean;
  toggleTokenStaking: (id: string, isStaked: boolean, yieldRate?: string) => void;
  seedInitialTransactions?: () => Promise<void>;
}
