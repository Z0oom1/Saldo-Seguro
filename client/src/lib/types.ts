/**
 * Saldo Seguro - Core Data Models
 * Design Philosophy: Minimalismo Nórdico
 */

export type TransactionType = 'entrada' | 'saida';
export type RecurrenceType = 'nenhuma' | 'semanal' | 'mensal' | 'anual';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  isCustom: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  name: string;
  description?: string;
  category: string;
  value: number;
  date: string;
  paymentMethod?: string;
  recurrence: RecurrenceType;
  isRecurrenceParent?: boolean;
  parentId?: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  description?: string;
  createdAt: string;
}

export interface BudgetLimit {
  id: string;
  category: string;
  monthlyLimit: number;
  currentSpent: number;
  month: string;
  alertThreshold: number;
}

export interface FinancialAlert {
  id: string;
  type: 'budget_warning' | 'unusual_spending' | 'goal_progress' | 'recurrence_due';
  message: string;
  severity: 'info' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
}

export interface FinancialData {
  transactions: Transaction[];
  categories: Category[];
  goals: FinancialGoal[];
  budgets: BudgetLimit[];
  alerts: FinancialAlert[];
}

export interface MultiUserData {
  [userId: string]: FinancialData;
}

export interface DashboardStats {
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  savings: number;
  monthlyChangePercent: number;
}
