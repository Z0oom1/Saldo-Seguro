/**
 * Saldo Seguro - Financial Context
 * Global state management for financial data
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Transaction, Category, FinancialGoal, BudgetLimit, FinancialAlert } from '@/lib/types';

interface FinancialContextType {
  transactions: Transaction[];
  categories: Category[];
  goals: FinancialGoal[];
  budgets: BudgetLimit[];
  alerts: FinancialAlert[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Transaction;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => Category;
  deleteCategory: (id: string) => void;
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => FinancialGoal;
  updateGoal: (id: string, updates: Partial<FinancialGoal>) => void;
  deleteGoal: (id: string) => void;
  addBudget: (budget: Omit<BudgetLimit, 'id'>) => BudgetLimit;
  updateBudget: (id: string, updates: Partial<BudgetLimit>) => void;
  deleteBudget: (id: string) => void;
  addAlert: (alert: Omit<FinancialAlert, 'id' | 'createdAt'>) => FinancialAlert;
  markAlertAsRead: (id: string) => void;
  deleteAlert: (id: string) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const financialData = useFinancialData();

  return (
    <FinancialContext.Provider value={financialData}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = (): FinancialContextType => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within FinancialProvider');
  }
  return context;
};
