import { Transaction, Category } from './types';

/**
 * Converte uma lista de transações para o formato CSV e inicia o download.
 */
export function exportTransactionsToCSV(transactions: Transaction[], categories: Category[]) {
  if (transactions.length === 0) return;

  const headers = ['Data', 'Nome', 'Descrição', 'Valor', 'Tipo', 'Categoria', 'Recorrente'];
  
  const rows = transactions.map(t => {
    const category = categories.find(c => c.id === t.category);
    const categoryName = category ? category.name : 'Sem Categoria';
    const date = new Date(t.date).toLocaleDateString('pt-BR');
    const type = t.type === 'entrada' ? 'Entrada' : 'Saída';
    const value = t.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const recurring = t.recurring ? (t.recurringInterval === 'mensal' ? 'Mensal' : t.recurringInterval === 'semanal' ? 'Semanal' : 'Anual') : 'Não';

    return [
      date,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${value}"`,
      type,
      categoryName,
      recurring
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `saldo_seguro_transacoes_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
