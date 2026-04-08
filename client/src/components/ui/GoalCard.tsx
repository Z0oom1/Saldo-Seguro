/**
 * Saldo Seguro - GoalCard Component
 * Design Philosophy: Minimalismo Nórdico
 * Displays financial goals with progress visualization
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FinancialGoal } from '@/lib/types';
import { financial } from '@/lib/financial';
import { Trash2, Edit2 } from 'lucide-react';

interface GoalCardProps {
  goal: FinancialGoal;
  onEdit?: (goal: FinancialGoal) => void;
  onDelete?: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
}) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  return (
    <motion.div
      className="card p-6 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground text-lg">{goal.name}</h4>
          {goal.description && (
            <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
          )}
        </div>
        
        {(onEdit || onDelete) && (
          <div className="flex gap-2 ml-4">
            {onEdit && (
              <motion.button
                onClick={() => onEdit(goal)}
                className="p-2 hover:bg-secondary rounded-lg transition-smooth"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit2 size={16} className="text-muted-foreground" />
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                onClick={() => onDelete(goal.id)}
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
            {financial.formatCurrency(goal.currentAmount)}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Goal Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Meta</p>
          <p className="font-semibold text-foreground">
            {financial.formatCurrency(goal.targetAmount)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Faltam</p>
          <p className={`font-semibold ${isCompleted ? 'text-green-600' : 'text-foreground'}`}>
            {isCompleted ? '✓ Completo!' : financial.formatCurrency(Math.max(0, remaining))}
          </p>
        </div>
      </div>

      {goal.deadline && (
        <p className="text-xs text-muted-foreground mt-3">
          Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
        </p>
      )}
    </motion.div>
  );
};
