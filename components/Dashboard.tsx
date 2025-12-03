import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Transaction, TransactionType } from '../types';
import { Wallet, TrendingUp, TrendingDown, Landmark } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

const COLORS = {
  [TransactionType.INCOME]: '#34d399', // Emerald 400
  [TransactionType.EXPENSE]: '#f87171', // Red 400
  [TransactionType.TAX]: '#fbbf24',     // Amber 400
};

const CATEGORY_COLORS = ['#bfdbfe', '#bbf7d0', '#fecaca', '#fde68a', '#ddd6fe', '#fed7aa', '#e2e8f0'];

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  
  const stats = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === TransactionType.INCOME) {
        acc.income += curr.amount;
        acc.balance += curr.amount;
      } else if (curr.type === TransactionType.EXPENSE) {
        acc.expense += curr.amount;
        acc.balance -= curr.amount;
      } else {
        acc.tax += curr.amount;
        acc.balance -= curr.amount;
      }
      return acc;
    }, { income: 0, expense: 0, tax: 0, balance: 0 });
  }, [transactions]);

  const pieData = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE || t.type === TransactionType.TAX)
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const barData = [
    { name: 'Receitas', amount: stats.income },
    { name: 'Despesas', amount: stats.expense },
    { name: 'Impostos', amount: stats.tax },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Wallet size={18} />
            <span className="text-xs font-medium uppercase tracking-wider">Saldo Atual</span>
          </div>
          <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-indigo-600' : 'text-rose-500'}`}>
            R$ {stats.balance.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <TrendingUp size={18} />
            <span className="text-xs font-medium uppercase tracking-wider">Receitas</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            R$ {stats.income.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-rose-400 mb-2">
            <TrendingDown size={18} />
            <span className="text-xs font-medium uppercase tracking-wider">Despesas</span>
          </div>
          <p className="text-2xl font-bold text-rose-600">
            R$ {stats.expense.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Landmark size={18} />
            <span className="text-xs font-medium uppercase tracking-wider">Impostos</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">
            R$ {stats.tax.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-6">Fluxo Financeiro</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Receitas' ? '#34d399' : entry.name === 'Despesas' ? '#f87171' : '#fbbf24'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-6">Despesas por Categoria</h3>
          <div className="h-64 w-full">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Sem dados de despesas
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};