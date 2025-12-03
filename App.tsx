import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from './types';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { SmartImport } from './components/SmartImport';
import { Plus, Sparkles, LayoutDashboard, List } from 'lucide-react';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list'>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pastel_finance_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('pastel_finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleSmartImport = (imported: Transaction[]) => {
    setTransactions(prev => [...prev, ...imported]);
    setActiveTab('list');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-0">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">Finanças<span className="text-indigo-600">Pastel</span></span>
            </div>
            
            <div className="flex items-center gap-2">
               <button 
                onClick={() => setShowImport(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                <Sparkles size={16} />
                Importar Extrato
              </button>
              <button 
                onClick={() => setShowForm(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5"
              >
                <Plus size={18} />
                Nova Transação
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:hidden flex gap-2 mb-6">
           <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            Extrato
          </button>
        </div>

        <div className={`space-y-6 ${activeTab === 'dashboard' ? 'block' : 'hidden md:block'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Visão Geral</h2>
          </div>
          <Dashboard transactions={transactions} />
        </div>

        <div className={`mt-8 space-y-6 ${activeTab === 'list' ? 'block' : 'hidden md:block'}`}>
           <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Transações</h2>
          </div>
          <TransactionList transactions={transactions} onDelete={removeTransaction} />
        </div>
      </main>

      {/* Mobile Sticky Actions */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-8 z-40 flex gap-3">
        <button 
          onClick={() => setShowImport(true)}
          className="flex-1 py-3 px-4 bg-indigo-50 text-indigo-700 rounded-xl font-medium flex items-center justify-center gap-2"
        >
          <Sparkles size={18} /> Importar
        </button>
        <button 
          onClick={() => setShowForm(true)}
          className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Adicionar
        </button>
      </div>

      {/* Modals */}
      {showForm && (
        <TransactionForm 
          onAdd={addTransaction} 
          onClose={() => setShowForm(false)} 
        />
      )}

      {showImport && (
        <SmartImport 
          onImport={handleSmartImport} 
          onClose={() => setShowImport(false)} 
        />
      )}
    </div>
  );
};

export default App;