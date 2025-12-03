import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { PlusCircle, X } from 'lucide-react';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, onClose }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    onAdd({
      description,
      amount: parseFloat(amount),
      date,
      type,
      category
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Nova Transação</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Tipo</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType(TransactionType.INCOME)}
                className={`p-2 rounded-xl text-sm font-medium transition-all ${
                  type === TransactionType.INCOME 
                    ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500 ring-offset-1' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Receita
              </button>
              <button
                type="button"
                onClick={() => setType(TransactionType.EXPENSE)}
                className={`p-2 rounded-xl text-sm font-medium transition-all ${
                  type === TransactionType.EXPENSE 
                    ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-500 ring-offset-1' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Despesa
              </button>
              <button
                type="button"
                onClick={() => setType(TransactionType.TAX)}
                className={`p-2 rounded-xl text-sm font-medium transition-all ${
                  type === TransactionType.TAX 
                    ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-500 ring-offset-1' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Imposto
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-200 outline-none text-slate-800 placeholder-slate-400"
              placeholder="Ex: Supermercado"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-200 outline-none text-slate-800"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-200 outline-none text-slate-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Categoria</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-200 outline-none text-slate-800 placeholder-slate-400"
              placeholder="Ex: Alimentação, Transporte..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 mt-4 transition-all"
          >
            <PlusCircle size={20} />
            Adicionar
          </button>
        </form>
      </div>
    </div>
  );
};