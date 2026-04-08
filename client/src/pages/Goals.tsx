/**
 * Saldo Seguro - Goals Page
 * Design Philosophy: Minimalismo Nórdico
 * Create, edit, and track financial goals
 */

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useFinancial } from '@/contexts/FinancialContext';
import { GoalCard } from '@/components/ui/GoalCard';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinancial();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    description: '',
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    if (editingId) {
      updateGoal(editingId, {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        deadline: formData.deadline || undefined,
        description: formData.description || undefined,
      });
      setEditingId(null);
    } else {
      addGoal({
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        deadline: formData.deadline || undefined,
        description: formData.description || undefined,
      });
    }

    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      description: '',
    });
    setShowForm(false);
  };

  const handleEdit = (goal: any) => {
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline || '',
      description: goal.description || '',
    });
    setEditingId(goal.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      description: '',
    });
  };

  return (
    <Layout title="Metas Financeiras">
      <motion.div
        className="max-w-4xl mx-auto space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Add Goal Button */}
        {!showForm && (
          <motion.button
            onClick={() => setShowForm(true)}
            className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-smooth"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={20} />
            Adicionar Nova Meta
          </motion.button>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <motion.form
            onSubmit={handleAddGoal}
            className="card p-6 rounded-lg space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {editingId ? 'Editar Meta' : 'Criar Nova Meta'}
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
                Nome da Meta *
              </label>
              <Input
                type="text"
                placeholder="Ex: Viagem para o exterior"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Valor Alvo *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-foreground font-semibold">R$</span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Valor Atual
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-foreground font-semibold">R$</span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Prazo
              </label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Descrição
              </label>
              <Textarea
                placeholder="Adicione detalhes sobre esta meta"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
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
                {editingId ? 'Atualizar Meta' : 'Criar Meta'}
              </Button>
            </div>
          </motion.form>
        )}

        {/* Goals List */}
        {goals.length > 0 ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm text-muted-foreground">
              {goals.length} meta{goals.length !== 1 ? 's' : ''} criada{goals.length !== 1 ? 's' : ''}
            </p>
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GoalCard
                  goal={goal}
                  onEdit={handleEdit}
                  onDelete={deleteGoal}
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
            <p className="text-2xl mb-2">🎯</p>
            <p className="text-lg font-semibold text-foreground">Nenhuma meta criada</p>
            <p className="text-muted-foreground">Comece a criar metas para acompanhar seus objetivos financeiros.</p>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
}
