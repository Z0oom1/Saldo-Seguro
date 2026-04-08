/**
 * Saldo Seguro - LocalStorage Management
 * Handles all data persistence for the application with multi-user support
 */

import { FinancialData, Category, Transaction, FinancialGoal, BudgetLimit, FinancialAlert, MultiUserData } from './types';

const STORAGE_KEY = 'saldo_seguro_multi_user_data';
const CURRENT_USER_KEY = 'saldo_seguro_current_user';

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  // Entradas
  { id: 'entrada_salario', name: 'Salário', type: 'entrada', icon: '💼', color: '#10B981', isCustom: false },
  { id: 'entrada_freelance', name: 'Freelance', type: 'entrada', icon: '💻', color: '#10B981', isCustom: false },
  { id: 'entrada_venda', name: 'Venda', type: 'entrada', icon: '🛍️', color: '#10B981', isCustom: false },
  { id: 'entrada_presente', name: 'Presente', type: 'entrada', icon: '🎁', color: '#10B981', isCustom: false },
  { id: 'entrada_investimento', name: 'Investimento Retornado', type: 'entrada', icon: '📈', color: '#10B981', isCustom: false },
  
  // Saídas
  { id: 'saida_alimentacao', name: 'Alimentação', type: 'saida', icon: '🍔', color: '#EF4444', isCustom: false },
  { id: 'saida_transporte', name: 'Transporte', type: 'saida', icon: '🚗', color: '#EF4444', isCustom: false },
  { id: 'saida_moradia', name: 'Moradia', type: 'saida', icon: '🏠', color: '#EF4444', isCustom: false },
  { id: 'saida_assinaturas', name: 'Assinaturas', type: 'saida', icon: '📱', color: '#EF4444', isCustom: false },
  { id: 'saida_compras', name: 'Compras', type: 'saida', icon: '🛒', color: '#EF4444', isCustom: false },
  { id: 'saida_saude', name: 'Saúde', type: 'saida', icon: '⚕️', color: '#EF4444', isCustom: false },
  { id: 'saida_lazer', name: 'Lazer', type: 'saida', icon: '🎬', color: '#EF4444', isCustom: false },
  { id: 'saida_educacao', name: 'Educação', type: 'saida', icon: '📚', color: '#EF4444', isCustom: false },
];

// Initialize default data for a user
const createDefaultData = (): FinancialData => ({
  transactions: [],
  categories: DEFAULT_CATEGORIES,
  goals: [],
  budgets: [],
  alerts: [],
});

export const storage = {
  // User Management
  getCurrentUser: (): string | null => {
    return localStorage.getItem(CURRENT_USER_KEY);
  },

  setCurrentUser: (userId: string | null): void => {
    if (userId) {
      localStorage.setItem(CURRENT_USER_KEY, userId);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // Multi-user data management
  getAllUsersData: (): MultiUserData => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading multi-user storage:', error);
      return {};
    }
  },

  setAllUsersData: (data: MultiUserData): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving multi-user storage:', error);
    }
  },

  // Current user data
  getData: (): FinancialData => {
    const userId = storage.getCurrentUser();
    if (!userId) return createDefaultData();

    const allData = storage.getAllUsersData();
    if (!allData[userId]) {
      allData[userId] = createDefaultData();
      storage.setAllUsersData(allData);
    }
    return allData[userId];
  },

  setData: (data: FinancialData): void => {
    const userId = storage.getCurrentUser();
    if (!userId) return;

    const allData = storage.getAllUsersData();
    allData[userId] = data;
    storage.setAllUsersData(allData);
  },

  // Transactions
  getTransactions: (): Transaction[] => {
    return storage.getData().transactions;
  },

  addTransaction: (transaction: Transaction): void => {
    const data = storage.getData();
    data.transactions.push(transaction);
    storage.setData(data);
  },

  updateTransaction: (id: string, updates: Partial<Transaction>): void => {
    const data = storage.getData();
    const index = data.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      data.transactions[index] = { ...data.transactions[index], ...updates };
      storage.setData(data);
    }
  },

  deleteTransaction: (id: string): void => {
    const data = storage.getData();
    data.transactions = data.transactions.filter(t => t.id !== id);
    storage.setData(data);
  },

  // Categories
  getCategories: (): Category[] => {
    return storage.getData().categories;
  },

  addCategory: (category: Category): void => {
    const data = storage.getData();
    data.categories.push(category);
    storage.setData(data);
  },

  deleteCategory: (id: string): void => {
    const data = storage.getData();
    data.categories = data.categories.filter(c => c.id !== id);
    storage.setData(data);
  },

  // Goals
  getGoals: (): FinancialGoal[] => {
    return storage.getData().goals;
  },

  addGoal: (goal: FinancialGoal): void => {
    const data = storage.getData();
    data.goals.push(goal);
    storage.setData(data);
  },

  updateGoal: (id: string, updates: Partial<FinancialGoal>): void => {
    const data = storage.getData();
    const index = data.goals.findIndex(g => g.id === id);
    if (index !== -1) {
      data.goals[index] = { ...data.goals[index], ...updates };
      storage.setData(data);
    }
  },

  deleteGoal: (id: string): void => {
    const data = storage.getData();
    data.goals = data.goals.filter(g => g.id !== id);
    storage.setData(data);
  },

  // Budgets
  getBudgets: (): BudgetLimit[] => {
    return storage.getData().budgets;
  },

  addBudget: (budget: BudgetLimit): void => {
    const data = storage.getData();
    data.budgets.push(budget);
    storage.setData(data);
  },

  updateBudget: (id: string, updates: Partial<BudgetLimit>): void => {
    const data = storage.getData();
    const index = data.budgets.findIndex(b => b.id === id);
    if (index !== -1) {
      data.budgets[index] = { ...data.budgets[index], ...updates };
      storage.setData(data);
    }
  },

  deleteBudget: (id: string): void => {
    const data = storage.getData();
    data.budgets = data.budgets.filter(b => b.id !== id);
    storage.setData(data);
  },

  // Alerts
  getAlerts: (): FinancialAlert[] => {
    return storage.getData().alerts;
  },

  addAlert: (alert: FinancialAlert): void => {
    const data = storage.getData();
    data.alerts.push(alert);
    storage.setData(data);
  },

  markAlertAsRead: (id: string): void => {
    const data = storage.getData();
    const index = data.alerts.findIndex(a => a.id === id);
    if (index !== -1) {
      data.alerts[index].read = true;
      storage.setData(data);
    }
  },

  deleteAlert: (id: string): void => {
    const data = storage.getData();
    data.alerts = data.alerts.filter(a => a.id !== id);
    storage.setData(data);
  },

  // Clear all data for current user
  clear: (): void => {
    const userId = storage.getCurrentUser();
    if (!userId) return;

    const allData = storage.getAllUsersData();
    delete allData[userId];
    storage.setAllUsersData(allData);
  },

  // Full reset
  resetAll: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
