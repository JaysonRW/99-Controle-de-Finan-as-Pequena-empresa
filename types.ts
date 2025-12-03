export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TAX = 'TAX'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO string YYYY-MM-DD
  type: TransactionType;
  category: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  totalTax: number;
  balance: number;
}

// Global definition for the XLSX library loaded via CDN
declare global {
  interface Window {
    XLSX: any;
  }
}