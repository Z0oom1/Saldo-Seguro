/**
 * Saldo Seguro - Settings Page
 * Design Philosophy: Minimalismo Nórdico
 * App configuration and preferences
 */

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinancial } from '@/contexts/FinancialContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Moon, Sun, Trash2, Plus } from 'lucide-react';
import { storage } from '@/lib/storage';
import { nanoid } from 'nanoid';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { categories, addCategory, deleteCategory } = useFinancial();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<'entrada' | 'saida'>('saida');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📁');

  const customCategories = categories.filter(c => c.isCustom);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      alert('Digite um nome para a categoria');
      return;
    }

    addCategory({
      name: newCategoryName,
      type: newCategoryType,
      icon: newCategoryIcon,
      color: newCategoryType === 'entrada' ? '#10B981' : '#EF4444',
      isCustom: true,
    });

    setNewCategoryName('');
    setNewCategoryIcon('📁');
  };

  const handleClearData = () => {
    if (window.confirm('Tem certeza? Todos os dados serão perdidos permanentemente.')) {
      storage.clear();
      window.location.reload();
    }
  };

  return (
    <Layout title="Configurações">
      <motion.div
        className="max-w-2xl mx-auto space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Theme Section */}
        <motion.section
          className="card p-6 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-foreground">Tema</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon size={24} className="text-primary" />
              ) : (
                <Sun size={24} className="text-primary" />
              )}
              <div>
                <p className="font-medium text-foreground">Modo {theme === 'dark' ? 'Escuro' : 'Claro'}</p>
                <p className="text-sm text-muted-foreground">Alterne entre temas claros e escuros</p>
              </div>
            </div>
            <Button
              onClick={toggleTheme}
              variant="outline"
            >
              {theme === 'dark' ? 'Claro' : 'Escuro'}
            </Button>
          </div>
        </motion.section>

        {/* Categories Section */}
        <motion.section
          className="card p-6 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-foreground">Categorias Personalizadas</h3>

          {/* Add New Category */}
          <div className="mb-6 p-4 bg-secondary rounded-lg space-y-3">
            <p className="text-sm font-medium text-foreground">Adicionar Nova Categoria</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="Nome da categoria"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <Select value={newCategoryType} onValueChange={(value: any) => setNewCategoryType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Ícone (emoji)"
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  maxLength={2}
                />
              </div>
              <Button
                onClick={handleAddCategory}
                className="flex items-center gap-2"
              >
                <Plus size={18} />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Custom Categories List */}
          {customCategories.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">Suas categorias personalizadas:</p>
              {customCategories.map((category) => (
                <motion.div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <p className="font-medium text-foreground">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.type === 'entrada' ? 'Entrada' : 'Saída'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCategory(category.id)}
                    className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <Trash2 size={18} />
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma categoria personalizada criada ainda
            </p>
          )}
        </motion.section>

        {/* Danger Zone */}
        <motion.section
          className="card p-6 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-red-600">Zona de Perigo</h3>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Essas ações são irreversíveis. Tenha cuidado ao usá-las.
            </p>
            <Button
              onClick={handleClearData}
              variant="destructive"
              className="w-full"
            >
              <Trash2 size={18} className="mr-2" />
              Limpar Todos os Dados
            </Button>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          className="card p-6 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-foreground">Sobre</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Saldo Seguro</strong> v1.0.0</p>
            <p>Sistema de controle financeiro pessoal moderno e intuitivo.</p>
            <p>Todos os dados são armazenados localmente no seu dispositivo.</p>
          </div>
        </motion.section>
      </motion.div>
    </Layout>
  );
}
