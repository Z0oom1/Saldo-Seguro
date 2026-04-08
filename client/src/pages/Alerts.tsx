/**
 * Saldo Seguro - Alerts Page
 * Design Philosophy: Minimalismo Nórdico
 * View and manage financial alerts and notifications
 */

import React, { useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useFinancial } from '@/contexts/FinancialContext';
import { AlertCard } from '@/components/ui/AlertCard';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Alerts() {
  const { alerts, markAlertAsRead, deleteAlert } = useFinancial();

  const unreadAlerts = useMemo(() => alerts.filter(a => !a.read), [alerts]);
  const readAlerts = useMemo(() => alerts.filter(a => a.read), [alerts]);

  const handleMarkAsRead = (id: string) => {
    markAlertAsRead(id);
  };

  const handleDismiss = (id: string) => {
    deleteAlert(id);
  };

  return (
    <Layout title="Notificações">
      <motion.div
        className="max-w-4xl mx-auto space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="card p-4 rounded-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-2xl font-bold text-primary">{unreadAlerts.length}</p>
            <p className="text-sm text-muted-foreground">Não lidas</p>
          </motion.div>
          <motion.div
            className="card p-4 rounded-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </motion.div>
        </div>

        {/* Alerts Tabs */}
        {alerts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="unread" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="unread">
                  Não Lidas ({unreadAlerts.length})
                </TabsTrigger>
                <TabsTrigger value="read">
                  Lidas ({readAlerts.length})
                </TabsTrigger>
              </TabsList>

              {/* Unread Alerts */}
              <TabsContent value="unread" className="space-y-3 mt-4">
                {unreadAlerts.length > 0 ? (
                  unreadAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <AlertCard
                            alert={alert}
                            onDismiss={handleDismiss}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(alert.id)}
                          className="flex-shrink-0"
                        >
                          Lido
                        </Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="card p-8 rounded-lg text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-2xl mb-2">✓</p>
                    <p className="text-foreground font-semibold">Sem notificações não lidas</p>
                    <p className="text-muted-foreground text-sm">Você está em dia!</p>
                  </motion.div>
                )}
              </TabsContent>

              {/* Read Alerts */}
              <TabsContent value="read" className="space-y-3 mt-4">
                {readAlerts.length > 0 ? (
                  readAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AlertCard
                        alert={alert}
                        onDismiss={handleDismiss}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="card p-8 rounded-lg text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-2xl mb-2">📭</p>
                    <p className="text-foreground font-semibold">Sem notificações lidas</p>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <motion.div
            className="card p-12 rounded-lg text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-2xl mb-2">🔔</p>
            <p className="text-lg font-semibold text-foreground">Sem notificações</p>
            <p className="text-muted-foreground">Você receberá alertas quando atingir os limites de orçamento ou outras condições importantes.</p>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
}
