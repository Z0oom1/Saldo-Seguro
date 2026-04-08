/**
 * Saldo Seguro - Budget Page
 * Design Philosophy: Minimalismo Nórdico
 * Create and manage monthly budget limits
 */

import React, { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useFinancial } from '@/contexts/FinancialContext';
import { BudgetCard } from '@/components/ui/BudgetCard';
import { financial } from '@/lib/financial';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

export default function Budget() {
  const { budgets, categories, addBudget, updateBudget, deleteBudget, transactions } = useFinancial();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const [formData, setFormData] = useState({
    category: '',
    monthlyLimit: '',
    alertThreshold: '90',
  });

  const expensesByCategory = useMemo(() => financial.getExpensesByCategory(transactions), [transactions]);

  const currentBudgets = useMemo(() => {
    return budgets.filter(b => b.month === currentMonth);
  }, [budgets, currentMonth]);

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.monthlyLimit) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const categorySpent = expensesByCategory[formData.category] || 0;

    if (editingId) {
      updateBudget(editingId, {
        monthlyLimit: parseFloat(formData.monthlyLimit),
        alertThreshold: parseFloat(formData.alertThreshold),
      });
      setEditingId(null);
    } else {
      addBudget({
        category: formData.category,
        monthlyLimit: parseFloat(formData.monthlyLimit),
        currentSpent: categorySpent,
        month: currentMonth,
        alertThreshold: parseFloat(formData.alertThreshold),
      });
    }

    setFormData({
      category: '',
      monthlyLimit: '',
      alertThreshold: '90',
    });
    setShowForm(false);
  };

  const handleEdit = (budget: any) => {
    setFormData({
      category: budget.category,
      monthlyLimit: budget.monthlyLimit.toString(),
      alertThreshold: budget.alertThreshold.toString(),
    });
    setEditingId(budget.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      category: '',
      monthlyLimit: '',
      alertThreshold: '90',
    });
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  const expenseCategories = categories.filter(c => c.type === 'saida');
  const usedCategories = currentBudgets.map(b => b.category);

  return (
    <Layout title="Orçamento Mensal">
      <motion.div
        className="max-w-4xl mx-auto space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Add Budget Button */}
        {!showForm && (
          <motion.button
            onClick={() => setShowForm(true)}
            className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-smooth"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={20} />
            Adicionar Orçamento
          </motion.button>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <motion.form
            onSubmit={handleAddBudget}
            className="card p-6 rounded-lg space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {editingId ? 'Editar Orçamento' : 'Criar Novo Orçamento'}
              </h3>
              <button
                type="button"
                onClick={handleCancel}
                className="p-2 hover:bg-secondary rounded-lg transition-smooth"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Categoria *
              </label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories
                    .filter(cat => !usedCategories.includes(cat.id) || cat.id === formData.category)
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Limite Mensal *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-foreground font-semibold">R$</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.monthlyLimit}
                  onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Alerta em (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.alertThreshold}
                onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Você receberá um alerta quando atingir este percentual do orçamento
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
              >
                {editingId ? 'Atualizar Orçamento' : 'Criar Orçamento'}
              </Button>
            </div>
          </motion.form>
        )}

        {/* Budgets List */}
        {currentBudgets.length > 0 ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm text-muted-foreground">
              {currentBudgets.length} orçamento{currentBudgets.length !== 1 ? 's' : ''} para {new Date(currentMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
            {currentBudgets.map((budget, index) => (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <BudgetCard
                  budget={budget}
                  category={getCategoryName(budget.category)}
                  onEdit={handleEdit}
                  onDelete={deleteBudget}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="card p-12 rounded-lg text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-2xl mb-2">💰</p>
            <p className="text-lg font-semibold text-foreground">Nenhum orçamento definido</p>
            <p className="text-muted-foreground">Comece a criar orçamentos para controlar seus gastos por categoria.</p>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
}
