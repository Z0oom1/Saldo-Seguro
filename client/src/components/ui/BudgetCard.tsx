/**
 * Saldo Seguro - BudgetCard Component
 * Design Philosophy: Minimalismo Nórdico
 * Displays budget limits and spending progress
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BudgetLimit, Category } from '@/lib/types';
import { financial } from '@/lib/financial';
import { Trash2, Edit2, AlertCircle } from 'lucide-react';

interface BudgetCardProps {
  budget: BudgetLimit;
  category?: Category;
  onEdit?: (budget: BudgetLimit) => void;
  onDelete?: (id: string) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  category,
  onEdit,
  onDelete,
}) => {
  const percentageUsed = (budget.currentSpent / budget.monthlyLimit) * 100;
  const isWarning = percentageUsed >= budget.alertThreshold;
  const isExceeded = budget.currentSpent > budget.monthlyLimit;
  const remaining = budget.monthlyLimit - budget.currentSpent;

  return (
    <motion.div
      className={`card p-6 rounded-lg border-l-4 ${
        isExceeded
          ? 'border-l-red-600 bg-red-50 dark:bg-red-950/20'
          : isWarning
          ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
          : 'border-l-primary bg-secondary'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {category && <span className="text-2xl">{category.icon}</span>}
            <div>
              <h4 className="font-semibold text-foreground">{category?.name || 'Categoria'}</h4>
              <p className="text-xs text-muted-foreground">{budget.month}</p>
            </div>
          </div>
        </div>

        {isWarning && (
          <div className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
            <AlertCircle size={16} />
            Alerta
          </div>
        )}

        {(onEdit || onDelete) && (
          <div className="flex gap-2 ml-4">
            {onEdit && (
              <motion.button
                onClick={() => onEdit(budget)}
                className="p-2 hover:bg-secondary rounded-lg transition-smooth"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit2 size={16} className="text-muted-foreground" />
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                onClick={() => onDelete(budget.id)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-smooth"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 size={16} className="text-red-600" />
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">
            {financial.formatCurrency(budget.currentSpent)}
          </span>
          <span className={`text-sm font-semibold ${
            isExceeded ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-foreground'
          }`}>
            {Math.round(percentageUsed)}%
          </span>
        </div>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              isExceeded ? 'bg-red-600' : isWarning ? 'bg-yellow-500' : 'bg-primary'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentageUsed, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Budget Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Limite</p>
          <p className="font-semibold text-foreground">
            {financial.formatCurrency(budget.monthlyLimit)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">{isExceeded ? 'Excedido' : 'Disponível'}</p>
          <p className={`font-semibold ${isExceeded ? 'text-red-600' : 'text-green-600'}`}>
            {isExceeded
              ? `+${financial.formatCurrency(Math.abs(remaining))}`
              : financial.formatCurrency(Math.max(0, remaining))}
          </p>
        </div>
      </div>

      {isWarning && (
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-3">
          ⚠️ Você atingiu {Math.round(percentageUsed)}% do seu orçamento
        </p>
      )}
    </motion.div>
  );
};
