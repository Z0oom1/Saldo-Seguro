/**
 * Saldo Seguro - TransactionCard Component
 * Design Philosophy: Minimalismo Nórdico
 * Displays individual transaction details
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Transaction, Category } from '@/lib/types';
import { financial } from '@/lib/financial';
import { Trash2, Edit2 } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  category?: Category;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  category,
  onEdit,
  onDelete,
}) => {
  const isIncome = transaction.type === 'entrada';
  const formattedValue = financial.formatCurrency(transaction.value);
  const formattedDate = new Date(transaction.date).toLocaleDateString('pt-BR');

  return (
    <motion.div
      className="card flex items-center justify-between p-4 hover:shadow-md transition-smooth"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className={`text-2xl p-2 rounded-lg ${
          isIncome ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
        }`}>
          {category?.icon || (isIncome ? '💰' : '💸')}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{transaction.name}</p>
          <p className="text-sm text-muted-foreground">{category?.name || 'Sem categoria'}</p>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className={`text-lg font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
            {isIncome ? '+' : '-'}{formattedValue}
          </p>
        </div>
        
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <motion.button
                onClick={() => onEdit(transaction)}
                className="p-2 hover:bg-secondary rounded-lg transition-smooth"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit2 size={16} className="text-muted-foreground" />
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                onClick={() => onDelete(transaction.id)}
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
    </motion.div>
  );
};
