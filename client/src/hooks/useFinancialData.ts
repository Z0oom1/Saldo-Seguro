/**
 * Saldo Seguro - Financial Data Hook
 * Manages financial data state and operations
 */

import { useState, useCallback, useEffect } from 'react';
import { Transaction, Category, FinancialGoal, BudgetLimit, FinancialAlert } from '@/lib/types';
import { storage } from '@/lib/storage';
import { nanoid } from 'nanoid';

export const useFinancialData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [budgets, setBudgets] = useState<BudgetLimit[]>([]);
  const [alerts, setAlerts] = useState<FinancialAlert[]>([]);

  // Initialize data from storage
  useEffect(() => {
    const data = storage.getData();
    setTransactions(data.transactions);
    setCategories(data.categories);
    setGoals(data.goals);
    setBudgets(data.budgets);
    setAlerts(data.alerts);
  }, []);

  // Transaction operations
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: nanoid(),
    };
    storage.addTransaction(newTransaction);
    setTransactions(prev => [...prev, newTransaction]);
    return newTransaction;
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    storage.updateTransaction(id, updates);
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    storage.deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  // Category operations
  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: nanoid(),
    };
    storage.addCategory(newCategory);
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  const deleteCategory = useCallback((id: string) => {
    storage.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  // Goal operations
  const addGoal = useCallback((goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    };
    storage.addGoal(newGoal);
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<FinancialGoal>) => {
    storage.updateGoal(id, updates);
    setGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, ...updates } : g))
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    storage.deleteGoal(id);
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  // Budget operations
  const addBudget = useCallback((budget: Omit<BudgetLimit, 'id'>) => {
    const newBudget: BudgetLimit = {
      ...budget,
      id: nanoid(),
    };
    storage.addBudget(newBudget);
    setBudgets(prev => [...prev, newBudget]);
    return newBudget;
  }, []);

  const updateBudget = useCallback((id: string, updates: Partial<BudgetLimit>) => {
    storage.updateBudget(id, updates);
    setBudgets(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updates } : b))
    );
  }, []);

  const deleteBudget = useCallback((id: string) => {
    storage.deleteBudget(id);
    setBudgets(prev => prev.filter(b => b.id !== id));
  }, []);

  // Alert operations
  const addAlert = useCallback((alert: Omit<FinancialAlert, 'id' | 'createdAt'>) => {
    const newAlert: FinancialAlert = {
      ...alert,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    };
    storage.addAlert(newAlert);
    setAlerts(prev => [...prev, newAlert]);
    return newAlert;
  }, []);

  const markAlertAsRead = useCallback((id: string) => {
    storage.markAlertAsRead(id);
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, read: true } : a))
    );
  }, []);

  const deleteAlert = useCallback((id: string) => {
    storage.deleteAlert(id);
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  return {
    transactions,
    categories,
    goals,
    budgets,
    alerts,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    addGoal,
    updateGoal,
    deleteGoal,
    addBudget,
    updateBudget,
    deleteBudget,
    addAlert,
    markAlertAsRead,
    deleteAlert,
  };
};
