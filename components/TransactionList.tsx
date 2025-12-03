import React from 'react';
import { Transaction, TransactionType } from '../types';
import { Trash2, Download, FileSpreadsheet } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  
  const handleExport = () => {
    // Basic array of arrays for CSV export
    const headers = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
    const data = transactions.map(t => [
      t.date,
      t.description,
      t.category,
      t.type === TransactionType.INCOME ? "Receita" : t.type === TransactionType.EXPENSE ? "Despesa" : "Imposto",
      t.amount
    ]);

    // Use XLSX library loaded in index.html
    const wb = window.XLSX.utils.book_new();
    const ws = window.XLSX.utils.aoa_to_sheet([headers, ...data]);
    window.XLSX.utils.book_append_sheet(wb, ws, "Finanças");
    window.XLSX.writeFile(wb, "financas_pastel.xlsx");
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
          <FileSpreadsheet size={32} />
        </div>
        <h3 className="text-lg font-medium text-slate-700">Nenhuma transação</h3>
        <p className="text-slate-500 mt-1">Adicione manualmente ou importe um extrato.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-semibold text-slate-700">Histórico Recente</h3>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Download size={16} />
          Exportar Excel
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="p-4 whitespace-nowrap">Data</th>
              <th className="p-4 whitespace-nowrap">Descrição</th>
              <th className="p-4 whitespace-nowrap">Categoria</th>
              <th className="p-4 whitespace-nowrap text-right">Valor</th>
              <th className="p-4 whitespace-nowrap text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-4 text-slate-500 whitespace-nowrap">
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      t.type === TransactionType.INCOME ? 'bg-emerald-400' : 
                      t.type === TransactionType.EXPENSE ? 'bg-rose-400' : 'bg-amber-400'
                    }`}></span>
                    {t.description}
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {t.category}
                  </span>
                </td>
                <td className={`p-4 text-right font-semibold whitespace-nowrap ${
                  t.type === TransactionType.INCOME ? 'text-emerald-600' : 
                  t.type === TransactionType.EXPENSE ? 'text-rose-600' : 'text-amber-600'
                }`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toFixed(2)}
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    title="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};