/**
 * Saldo Seguro - StatCard Component
 * Design Philosophy: Minimalismo Nórdico
 * Displays financial statistics in a clean card format
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  type?: 'income' | 'expense' | 'balance' | 'savings';
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  type = 'balance',
  icon,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'income':
        return 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20';
      case 'expense':
        return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20';
      case 'savings':
        return 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20';
      default:
        return 'border-l-4 border-l-primary bg-secondary';
    }
  };

  return (
    <motion.div
      className={`card ${getTypeStyles()} p-4 rounded-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-3xl opacity-50">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};
