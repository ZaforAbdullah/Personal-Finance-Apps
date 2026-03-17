export interface Balance {
  current: number;
  income: number;
  expenses: number;
}

export interface Transaction {
  id: string;
  name: string;
  avatarUrl?: string | null;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
}

export interface TransactionPage {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Budget {
  id: string;
  category: string;
  maximum: number;
  theme: string;
  spent: number;
  remaining: number;
  transactions: Transaction[];
}

export interface Pot {
  id: string;
  name: string;
  target: number;
  total: number;
  theme: string;
  percentage: number;
}

export interface RecurringBill {
  id: string;
  name: string;
  avatarUrl?: string | null;
  category: string;
  amount: number;
  dueDay: number;
  isPaid: boolean;
  isDueSoon: boolean;
}

export interface BillsSummary {
  totalUpcoming: number;
  totalPaid: number;
  dueSoon: number;
}

export interface Overview {
  balance: Balance;
  pots: Pot[];
  transactions: Transaction[];
  budgets: Budget[];
  billsSummary: BillsSummary;
}

export interface BudgetInput {
  category: string;
  maximum: number;
  theme: string;
}

export interface PotInput {
  name: string;
  target: number;
  theme: string;
}

export const THEME_COLORS: { label: string; value: string }[] = [
  { label: 'Green', value: '#277C78' },
  { label: 'Yellow', value: '#F2CDAC' },
  { label: 'Cyan', value: '#82C9D7' },
  { label: 'Navy', value: '#626070' },
  { label: 'Red', value: '#C94736' },
  { label: 'Purple', value: '#826CB0' },
  { label: 'Turquoise', value: '#597C7C' },
  { label: 'Brown', value: '#93674F' },
  { label: 'Magenta', value: '#934F6F' },
  { label: 'Blue', value: '#3F82B2' },
  { label: 'Grey', value: '#97A0AC' },
  { label: 'Army Green', value: '#7F9161' },
  { label: 'Gold', value: '#CAB361' },
  { label: 'Orange', value: '#BE6C49' },
];

export const CATEGORIES = [
  'All Transactions',
  'Entertainment',
  'Bills',
  'Dining Out',
  'Personal Care',
  'General',
  'Groceries',
  'Transportation',
  'Shopping',
  'Education',
  'Lifestyle',
];

export const SORT_OPTIONS = [
  { label: 'Latest', value: 'latest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'A to Z', value: 'a-z' },
  { label: 'Z to A', value: 'z-a' },
  { label: 'Highest', value: 'highest' },
  { label: 'Lowest', value: 'lowest' },
];
