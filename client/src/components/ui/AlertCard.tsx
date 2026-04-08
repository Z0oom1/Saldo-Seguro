/**
 * Saldo Seguro - AlertCard Component
 * Design Philosophy: Minimalismo Nórdico
 * Displays financial alerts and notifications
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FinancialAlert } from '@/lib/types';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface AlertCardProps {
  alert: FinancialAlert;
  onDismiss?: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onDismiss,
}) => {
  const getIcon = () => {
    switch (alert.severity) {
      case 'error':
        return <AlertCircle size={20} className="text-red-600" />;
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-600" />;
      default:
        return <Info size={20} className="text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (alert.severity) {
      case 'error':
        return 'bg-red-50 dark:bg-red-950/20 border-l-4 border-l-red-600';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-l-yellow-600';
      default:
        return 'bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-600';
    }
  };

  return (
    <motion.div
      className={`card p-4 rounded-lg flex items-start gap-3 ${getStyles()}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex-shrink-0 pt-0.5">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{alert.message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(alert.createdAt).toLocaleDateString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {onDismiss && (
        <motion.button
          onClick={() => onDismiss(alert.id)}
          className="p-2 hover:bg-secondary rounded-lg transition-smooth flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={16} className="text-muted-foreground" />
        </motion.button>
      )}
    </motion.div>
  );
};
