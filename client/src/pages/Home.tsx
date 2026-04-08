/**
 * Saldo Seguro - Home/Dashboard Page
 * Design Philosophy: Minimalismo Nórdico
 * Main dashboard showing financial overview
 */

import React, { useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/ui/StatCard';
import { TransactionCard } from '@/components/ui/TransactionCard';
import { useFinancial } from '@/contexts/FinancialContext';
import { financial } from '@/lib/financial';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function Home() {
  const { transactions, categories } = useFinancial();

  const stats = useMemo(() => financial.getDashboardStats(transactions), [transactions]);
  const topExpenses = useMemo(() => financial.getTopExpenses(transactions, 5), [transactions]);
  const expensesByCategory = useMemo(() => financial.getExpensesByCategory(transactions), [transactions]);
  const mostExpensive = useMemo(() => financial.getMostExpensiveCategory(transactions), [transactions]);

  // Prepare data for pie chart
  const pieData = useMemo(() => {
    return Object.entries(expensesByCategory).map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        name: category?.name || 'Outro',
        value: amount,
        color: category?.color || '#10B981',
      };
    });
  }, [expensesByCategory, categories]);

  // Prepare data for line chart (last 7 days)
  const lineData = useMemo(() => {
    const days = 7;
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayTransactions = transactions.filter(t => t.date === dateStr);
      const dayExpense = dayTransactions
        .filter(t => t.type === 'saida')
        .reduce((total, t) => total + t.value, 0);

      data.push({
        date: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        expense: dayExpense,
      });
    }

    return data;
  }, [transactions]);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Sem categoria';
  };

  return (
    <Layout title="Dashboard">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <StatCard
            label="Saldo Atual"
            value={financial.formatCurrency(stats.currentBalance)}
            type="balance"
            icon="💰"
          />
          <StatCard
            label="Total Ganho"
            value={financial.formatCurrency(stats.totalIncome)}
            type="income"
            icon="📈"
          />
          <StatCard
            label="Total Gasto"
            value={financial.formatCurrency(stats.totalExpense)}
            type="expense"
            icon="📉"
          />
          <StatCard
            label="Economia"
            value={financial.formatCurrency(stats.savings)}
            change={stats.monthlyChangePercent}
            type="savings"
            icon="🎯"
          />
        </motion.div>

        {/* Charts Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Pie Chart */}
          {pieData.length > 0 && (
            <div className="card p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Gastos por Categoria</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => financial.formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Line Chart */}
          {lineData.length > 0 && (
            <div className="card p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Gastos - Últimos 7 Dias</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip formatter={(value) => financial.formatCurrency(value as number)} />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--primary)', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Insights Section */}
        {mostExpensive && (
          <motion.div
            className="card p-6 rounded-lg bg-accent/10 border border-accent/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-2 text-foreground">💡 Insight Financeiro</h3>
            <p className="text-muted-foreground">
              Você gastou <span className="font-bold text-foreground">{financial.formatCurrency(mostExpensive.amount)}</span> com{' '}
              <span className="font-bold text-foreground">{getCategoryName(mostExpensive.category)}</span> este mês. Esta é sua categoria com maior gasto.
            </p>
          </motion.div>
        )}

        {/* Recent Transactions */}
        {topExpenses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-foreground">Maiores Gastos</h3>
            <div className="space-y-3">
              {topExpenses.map((transaction, index) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  category={categories.find(c => c.id === transaction.category)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {transactions.length === 0 && (
          <motion.div
            className="card p-12 rounded-lg text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-2xl mb-2">📊</p>
            <p className="text-lg font-semibold text-foreground mb-2">Nenhuma transação registrada</p>
            <p className="text-muted-foreground">Comece a registrar suas entradas e saídas para ver suas estatísticas aqui.</p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
