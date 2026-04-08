/**
 * Saldo Seguro - Analysis Page
 * Design Philosophy: Minimalismo Nórdico
 * Financial insights and advanced analytics
 */

import React, { useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useFinancial } from '@/contexts/FinancialContext';
import { financial } from '@/lib/financial';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/ui/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function Analysis() {
  const { transactions } = useFinancial();

  const topExpenses = useMemo(() => financial.getTopExpenses(transactions, 10), [transactions]);
  const mostExpensive = useMemo(() => financial.getMostExpensiveCategory(transactions), [transactions]);
  const dailyAverage = useMemo(() => financial.getDailyAverageExpense(transactions), [transactions]);
  const dayWithMostSpending = useMemo(() => financial.getDayWithMostSpending(transactions), [transactions]);

  // Prepare data for bar chart (top expenses by category)
  const expensesByCategory = useMemo(() => financial.getExpensesByCategory(transactions), [transactions]);
  const barChartData = useMemo(() => {
    return Object.entries(expensesByCategory)
      .map(([categoryId, amount]) => ({
        name: categoryId,
        value: amount,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [expensesByCategory]);

  // Prepare data for radar chart (spending by day of week)
  const radarData = useMemo(() => {
    const daySpending: Record<string, number> = {
      'Segunda': 0,
      'Terça': 0,
      'Quarta': 0,
      'Quinta': 0,
      'Sexta': 0,
      'Sábado': 0,
      'Domingo': 0,
    };

    transactions
      .filter(t => t.type === 'saida')
      .forEach(t => {
        const day = new Date(t.date).getDay();
        const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        daySpending[dayNames[day]] += t.value;
      });

    return Object.entries(daySpending).map(([day, value]) => ({
      day,
      value,
    }));
  }, [transactions]);

  return (
    <Layout title="Análise Financeira">
      <motion.div
        className="max-w-6xl mx-auto space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Key Insights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <StatCard
            label="Média Diária"
            value={financial.formatCurrency(dailyAverage)}
            type="expense"
            icon="📊"
          />
          {dayWithMostSpending && (
            <StatCard
              label={`Maior Gasto (${dayWithMostSpending.day})`}
              value={financial.formatCurrency(dayWithMostSpending.amount)}
              type="expense"
              icon="📈"
            />
          )}
          {mostExpensive && (
            <StatCard
              label="Categoria com Mais Gasto"
              value={mostExpensive.category}
              type="expense"
              icon="🎯"
            />
          )}
          <StatCard
            label="Total de Transações"
            value={transactions.length.toString()}
            type="balance"
            icon="📋"
          />
        </motion.div>

        {/* Charts */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Bar Chart - Top Expenses by Category */}
          {barChartData.length > 0 && (
            <div className="card p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Top 8 Categorias</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip formatter={(value) => financial.formatCurrency(value as number)} />
                  <Bar dataKey="value" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Radar Chart - Spending by Day */}
          {radarData.length > 0 && (
            <div className="card p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Gastos por Dia da Semana</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="day" stroke="var(--muted-foreground)" />
                  <PolarRadiusAxis stroke="var(--muted-foreground)" />
                  <Radar
                    name="Gastos"
                    dataKey="value"
                    stroke="var(--primary)"
                    fill="var(--primary)"
                    fillOpacity={0.6}
                  />
                  <Tooltip formatter={(value) => financial.formatCurrency(value as number)} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Top Expenses List */}
        {topExpenses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-foreground">Top 10 Maiores Gastos</h3>
            <div className="space-y-3">
              {topExpenses.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  className="card flex items-center justify-between p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-red-600">
                    -{financial.formatCurrency(transaction.value)}
                  </p>
                </motion.div>
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
            <p className="text-lg font-semibold text-foreground">Sem dados para análise</p>
            <p className="text-muted-foreground">Adicione transações para ver análises detalhadas.</p>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
}
