/**
 * Saldo Seguro - Edit Transaction Page
 * Design Philosophy: Minimalismo Nórdico
 * Form for editing existing transactions
 */

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useFinancial } from '@/contexts/FinancialContext';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface EditTransactionProps {
  params?: {
    id: string;
  };
}

export default function EditTransaction() {
  const { transactions, categories, updateTransaction } = useFinancial();
  const [, navigate] = useLocation();
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const [type, setType] = useState<'entrada' | 'saida'>('saida');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [recurrence, setRecurrence] = useState<'nenhuma' | 'semanal' | 'mensal' | 'anual'>('nenhuma');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCategories = categories.filter(c => c.type === type);

  useEffect(() => {
    // Get transaction ID from URL or props
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setTransactionId(id);
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        setType(transaction.type);
        setName(transaction.name);
        setValue(transaction.value.toString());
        setCategory(transaction.category);
        setDate(transaction.date);
        setDescription(transaction.description || '');
        setPaymentMethod(transaction.paymentMethod || '');
        setRecurrence(transaction.recurrence);
      }
    }
  }, [transactions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId || !name || !value || !category) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      updateTransaction(transactionId, {
        type,
        name,
        value: parseFloat(value),
        category,
        date,
        description: description || undefined,
        paymentMethod: paymentMethod || undefined,
        recurrence,
      });

      navigate('/history');
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Erro ao atualizar transação');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!transactionId) {
    return (
      <Layout title="Editar Transação">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Transação não encontrada</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Editar Transação">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div className="flex gap-4">
            <motion.button
              type="button"
              onClick={() => {
                setType('entrada');
                setCategory('');
              }}
              className={`flex-1 py-4 rounded-lg font-semibold transition-smooth flex items-center justify-center gap-2 ${
                type === 'entrada'
                  ? 'bg-green-500 text-white'
                  : 'bg-secondary text-foreground hover:bg-muted'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowUp size={20} />
              Entrada
            </motion.button>
            <motion.button
              type="button"
              onClick={() => {
                setType('saida');
                setCategory('');
              }}
              className={`flex-1 py-4 rounded-lg font-semibold transition-smooth flex items-center justify-center gap-2 ${
                type === 'saida'
                  ? 'bg-red-500 text-white'
                  : 'bg-secondary text-foreground hover:bg-muted'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowDown size={20} />
              Saída
            </motion.button>
          </div>

          {/* Value Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Valor *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-foreground font-semibold">R$</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nome da Transação *
            </label>
            <Input
              type="text"
              placeholder="Ex: Compra no mercado"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Categoria *
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Data
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descrição
            </label>
            <Textarea
              placeholder="Adicione detalhes sobre esta transação"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Forma de Pagamento
            </label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">💵 Dinheiro</SelectItem>
                <SelectItem value="credito">💳 Crédito</SelectItem>
                <SelectItem value="debito">🏧 Débito</SelectItem>
                <SelectItem value="transferencia">🔄 Transferência</SelectItem>
                <SelectItem value="pix">📱 PIX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recurrence */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Recorrência
            </label>
            <Select value={recurrence} onValueChange={(value: any) => setRecurrence(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a recorrência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nenhuma">Nenhuma</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/history')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Salvando...' : 'Atualizar Transação'}
            </Button>
          </div>
        </form>
      </motion.div>
    </Layout>
  );
}
