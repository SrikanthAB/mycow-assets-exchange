
import { Token, Transaction } from './types';

// Initial portfolio with some RWA tokens
export const initialTokens: Token[] = [
  {
    id: "1",
    name: "Embassy REIT",
    symbol: "EMREIT",
    category: "Real Estate",
    price: 356.42,
    priceString: "₹356.42",
    change: 2.34,
    balance: 10,
    yield: "8.5% APY"
  },
  {
    id: "2",
    name: "Digital Gold",
    symbol: "DGOLD",
    category: "Commodity",
    price: 7245.30,
    priceString: "₹7,245.30",
    change: 0.87,
    balance: 2.5,
    yield: "4% APY"
  },
  {
    id: "3",
    name: "Movie Fund I",
    symbol: "MF01",
    category: "Entertainment",
    price: 115.67,
    priceString: "₹115.67",
    change: 12.43,
    balance: 25,
    yield: "14.2% APY"
  },
  {
    id: "6",
    name: "MyCow Token",
    symbol: "MCT",
    category: "Native Token",
    price: 24.37,
    priceString: "₹24.37",
    change: 5.63,
    balance: 100,
    yield: "7.8% APY"
  }
];

// Initial wallet balance (10,00,000 rupees as requested)
export const initialWalletBalance = 1000000;

