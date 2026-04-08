/**
 * Saldo Seguro - Financial Business Logic
 * Core calculations and analysis functions
 */

import { Transaction, DashboardStats, BudgetLimit } from './types';

export const financial = {
  // Calculate current balance
  calculateBalance: (transactions: Transaction[]): number => {
    return transactions.reduce((total, tx) => {
      return tx.type === 'entrada' ? total + tx.value : total - tx.value;
    }, 0);
  },

  // Get transactions for current month
  getCurrentMonthTransactions: (transactions: Transaction[]): Transaction[] => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });
  },

  // Calculate monthly income
  calculateMonthlyIncome: (transactions: Transaction[]): number => {
    const monthTransactions = financial.getCurrentMonthTransactions(transactions);
    return monthTransactions
      .filter(tx => tx.type === 'entrada')
      .reduce((total, tx) => total + tx.value, 0);
  },

  // Calculate monthly expense
  calculateMonthlyExpense: (transactions: Transaction[]): number => {
    const monthTransactions = financial.getCurrentMonthTransactions(transactions);
    return monthTransactions
      .filter(tx => tx.type === 'saida')
      .reduce((total, tx) => total + tx.value, 0);
  },

  // Calculate monthly savings
  calculateMonthlySavings: (transactions: Transaction[]): number => {
    return financial.calculateMonthlyIncome(transactions) - financial.calculateMonthlyExpense(transactions);
  },

  // Get dashboard stats
  getDashboardStats: (transactions: Transaction[]): DashboardStats => {
    const currentBalance = financial.calculateBalance(transactions);
    const totalIncome = financial.calculateMonthlyIncome(transactions);
    const totalExpense = financial.calculateMonthlyExpense(transactions);
    const savings = financial.calculateMonthlySavings(transactions);

    // Calculate month-over-month change
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === lastMonth.getMonth() && txDate.getFullYear() === lastMonth.getFullYear();
    });
    const lastMonthExpense = lastMonthTransactions
      .filter(tx => tx.type === 'saida')
      .reduce((total, tx) => total + tx.value, 0);
    const monthlyChangePercent = lastMonthExpense > 0 
      ? ((totalExpense - lastMonthExpense) / lastMonthExpense) * 100 
      : 0;

    return {
      currentBalance,
      totalIncome,
      totalExpense,
      savings,
      monthlyChangePercent,
    };
  },

  // Get expenses by category
  getExpensesByCategory: (transactions: Transaction[]): Record<string, number> => {
    const monthTransactions = financial.getCurrentMonthTransactions(transactions);
    const expenses: Record<string, number> = {};

    monthTransactions
      .filter(tx => tx.type === 'saida')
      .forEach(tx => {
        expenses[tx.category] = (expenses[tx.category] || 0) + tx.value;
      });

    return expenses;
  },

  // Get top expenses
  getTopExpenses: (transactions: Transaction[], limit: number = 5): Transaction[] => {
    const monthTransactions = financial.getCurrentMonthTransactions(transactions);
    return monthTransactions
      .filter(tx => tx.type === 'saida')
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  },

  // Get most expensive category
  getMostExpensiveCategory: (transactions: Transaction[]): { category: string; amount: number } | null => {
    const expenses = financial.getExpensesByCategory(transactions);
    if (Object.keys(expenses).length === 0) return null;

    const [category, amount] = Object.entries(expenses).reduce((max, current) =>
      current[1] > max[1] ? current : max
    );

    return { category, amount };
  },

  // Get daily average expense
  getDailyAverageExpense: (transactions: Transaction[]): number => {
    const monthTransactions = financial.getCurrentMonthTransactions(transactions);
    const totalExpense = monthTransactions
      .filter(tx => tx.type === 'saida')
      .reduce((total, tx) => total + tx.value, 0);

    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    return totalExpense / daysInMonth;
  },

  // Get day of week with most spending
  getDayWithMostSpending: (transactions: Transaction[]): { day: string; amount: number } | null => {
    const monthTransactions = financial.getCurrentMonthTransactions(transactions);
    const daySpending: Record<number, number> = {};
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    monthTransactions
      .filter(tx => tx.type === 'saida')
      .forEach(tx => {
        const day = new Date(tx.date).getDay();
        daySpending[day] = (daySpending[day] || 0) + tx.value;
      });

    if (Object.keys(daySpending).length === 0) return null;

    const [day, amount] = Object.entries(daySpending).reduce((max, current) =>
      Number(current[1]) > Number(max[1]) ? current : max
    );

    return { day: dayNames[Number(day)], amount: Number(amount) };
  },

  // Check budget alerts
  checkBudgetAlerts: (transactions: Transaction[], budgets: BudgetLimit[]): BudgetLimit[] => {
    const monthTransactions = financial.getCurrentMonthTransactions(transactions);
    const alerts: BudgetLimit[] = [];

    budgets.forEach(budget => {
      const categorySpent = monthTransactions
        .filter(tx => tx.type === 'saida' && tx.category === budget.category)
        .reduce((total, tx) => total + tx.value, 0);

      const percentageUsed = (categorySpent / budget.monthlyLimit) * 100;
      if (percentageUsed >= budget.alertThreshold) {
        alerts.push({ ...budget, currentSpent: categorySpent });
      }
    });

    return alerts;
  },

  // Format currency
  formatCurrency: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  },

  // Format percentage
  formatPercentage: (value: number): string => {
    return `${value.toFixed(1)}%`;
  },
};
