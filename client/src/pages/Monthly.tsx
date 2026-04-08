/**
 * Saldo Seguro - Monthly View Page
 * Agrupa transações por mês e mostra detalhes
 */

import React, { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useFinancial } from '@/contexts/FinancialContext';
import { TransactionCard } from '@/components/ui/TransactionCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Calendar, ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/financial';

export default function Monthly() {
  const { transactions, categories, deleteTransaction } = useFinancial();
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);

  // Agrupar transações por mês
  const monthlyData = useMemo(() => {
    const groups: Record<string, { 
      id: string; 
      label: string; 
      income: number; 
      expense: number; 
      transactions: typeof transactions 
    }> = {};

    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
      
      if (!groups[monthKey]) {
        groups[monthKey] = {
          id: monthKey,
          label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
          income: 0,
          expense: 0,
          transactions: []
        };
      }

      groups[monthKey].transactions.push(t);
      if (t.type === 'entrada') {
        groups[monthKey].income += t.value;
      } else {
        groups[monthKey].expense += t.value;
      }
    });

    // Ordenar meses (mais recente primeiro)
    return Object.values(groups).sort((a, b) => b.id.localeCompare(a.id));
  }, [transactions]);

  const toggleMonth = (monthId: string) => {
    setExpandedMonths(prev => 
      prev.includes(monthId) 
        ? prev.filter(id => id !== monthId) 
        : [...prev, monthId]
    );
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <Layout title="Visão Mensal">
      <div className="max-w-4xl mx-auto space-y-4 pb-20">
        {monthlyData.length > 0 ? (
          monthlyData.map((month) => {
            const isExpanded = expandedMonths.includes(month.id);
            const balance = month.income - month.expense;

            return (
              <motion.div 
                key={month.id}
                layout
                className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
              >
                {/* Cabeçalho do Mês */}
                <button 
                  onClick={() => toggleMonth(month.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Calendar size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground">{month.label}</h3>
                      <p className="text-xs text-muted-foreground">{month.transactions.length} transações</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className={`text-sm font-medium ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(balance)}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border bg-muted/20"
                    >
                      {/* Resumo do Mês */}
                      <div className="grid grid-cols-3 gap-2 p-4 border-b border-border bg-card/50">
                        <div className="flex flex-col items-center p-2 bg-green-50 dark:bg-green-900/10 rounded-lg">
                          <ArrowUpCircle size={16} className="text-green-600 mb-1" />
                          <span className="text-[10px] uppercase text-muted-foreground">Ganhos</span>
                          <span className="text-sm font-bold text-green-600">{formatCurrency(month.income)}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-red-50 dark:bg-red-900/10 rounded-lg">
                          <ArrowDownCircle size={16} className="text-red-600 mb-1" />
                          <span className="text-[10px] uppercase text-muted-foreground">Gastos</span>
                          <span className="text-sm font-bold text-red-600">{formatCurrency(month.expense)}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                          <Wallet size={16} className="text-blue-600 mb-1" />
                          <span className="text-[10px] uppercase text-muted-foreground">Saldo</span>
                          <span className={`text-sm font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {formatCurrency(balance)}
                          </span>
                        </div>
                      </div>

                      {/* Lista de Transações */}
                      <div className="p-4 space-y-3">
                        {month.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t) => (
                          <TransactionCard 
                            key={t.id}
                            transaction={t}
                            category={getCategoryName(t.category)}
                            onDelete={deleteTransaction}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
            <p className="text-4xl mb-4">📅</p>
            <h3 className="text-xl font-semibold">Nenhum dado mensal</h3>
            <p className="text-muted-foreground">Comece adicionando transações para ver o resumo mensal.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
