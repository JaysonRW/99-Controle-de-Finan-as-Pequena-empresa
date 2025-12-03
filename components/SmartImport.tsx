import React, { useState } from 'react';
import { Transaction } from '../types';
import { parseBankStatement } from '../services/geminiService';
import { Sparkles, ArrowRight, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';

interface SmartImportProps {
  onImport: (transactions: Transaction[]) => void;
  onClose: () => void;
}

export const SmartImport: React.FC<SmartImportProps> = ({ onImport, onClose }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Transaction[] | null>(null);

  const handleParse = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await parseBankStatement(text);
      setPreview(result);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (preview) {
      onImport(preview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Importação Inteligente</h2>
              <p className="text-sm text-slate-500">Cole o texto do seu extrato bancário</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {!preview ? (
            <div className="space-y-4">
               <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm border border-blue-100">
                <strong>Como funciona:</strong> Copie as linhas do seu PDF ou site do banco e cole abaixo. Nossa IA irá identificar automaticamente a data, valor e categoria.
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ex: 
01/10/2023 Uber *Trip -25.90
02/10/2023 Salário Mensal 3500.00
03/10/2023 Padaria Doce Vida -15.50"
                className="w-full h-64 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-200 outline-none resize-none font-mono text-sm text-slate-700"
              />
              {error && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-lg text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" />
                {preview.length} Transações Encontradas
              </h3>
              <div className="border rounded-xl overflow-hidden border-slate-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="p-3">Data</th>
                      <th className="p-3">Descrição</th>
                      <th className="p-3">Categoria</th>
                      <th className="p-3 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {preview.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-600">{t.date}</td>
                        <td className="p-3 text-slate-800 font-medium">{t.description}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600">
                            {t.category}
                          </span>
                        </td>
                        <td className={`p-3 text-right font-medium ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {t.type === 'INCOME' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          {!preview ? (
            <button
              onClick={handleParse}
              disabled={loading || !text.trim()}
              className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl font-medium shadow-md shadow-indigo-100 flex items-center gap-2 transition-all"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              Processar com IA
            </button>
          ) : (
            <>
              <button
                onClick={() => setPreview(null)}
                className="py-2.5 px-6 text-slate-600 hover:bg-slate-200 rounded-xl font-medium transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirm}
                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-md shadow-emerald-100 flex items-center gap-2 transition-all"
              >
                Confirmar Importação <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};