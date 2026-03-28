/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Plus, Minus, CreditCard, Calendar, Tag, FileText, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { cn } from '../utils.ts';
import { TransactionType, Category } from '../types.ts';
import { CategoryIcon } from './CategoryManager.tsx';
import { DEFAULT_CATEGORIES } from '../constants.ts';

interface TransactionFormProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (data: any) => void;
 categories: Category[];
 initialData?: any;
 initialType?: TransactionType;
 onOpenCategories?: () => void;
}

export function TransactionForm({ isOpen, onClose, onSubmit, categories, initialData, initialType, onOpenCategories }: TransactionFormProps) {
 const [type, setType] = React.useState<TransactionType>(initialData?.type || initialType || 'expense_variable');
 const [description, setDescription] = React.useState(initialData?.description || '');
 const [amount, setAmount] = React.useState(initialData?.amount || '');
 const [date, setDate] = React.useState(initialData?.date || new Date().toISOString().split('T')[0]);
 const [categoryId, setCategoryId] = React.useState(initialData?.categoryId || '');
 const [status, setStatus] = React.useState<'paid' | 'pending'>(initialData?.status || 'paid');
 const [installments, setInstallments] = React.useState(initialData?.installments || { current: 1, total: 1 });
 const [notes, setNotes] = React.useState(initialData?.notes || '');
 const [error, setError] = React.useState('');

 const [isSubmitting, setIsSubmitting] = React.useState(false);

 React.useEffect(() => {
 setError('');
 if (initialData) {
 setType(initialData.type);
 setDescription(initialData.description);
 setAmount(initialData.amount);
 setDate(initialData.date.split('T')[0]);
 setCategoryId(initialData.categoryId);
 setStatus(initialData.status);
 setInstallments(initialData.installments || { current: 1, total: 1 });
 setNotes(initialData.notes || '');
 } else {
 setType(initialType || 'expense_variable');
 setDescription('');
 setAmount('');
 setDate(new Date().toISOString().split('T')[0]);
 setCategoryId('');
 setStatus('paid');
 setInstallments({ current: 1, total: 1 });
 setNotes('');
 }
 setIsSubmitting(false);
 }, [initialData, initialType, isOpen]);

 if (!isOpen) return null;

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError('');
 
 if (!categoryId) {
 setError('Por favor, selecione uma categoria.');
 return;
 }

 const numAmount = Number(amount);
 if (isNaN(numAmount) || numAmount <= 0) {
 setError('O valor deve ser maior que zero.');
 return;
 }

 setIsSubmitting(true);
 try {
 const formattedDate = date.includes('T') ? date : `${date}T12:00:00Z`;

 const transactionData: any = {
 type,
 description,
 amount: Number(amount),
 date: formattedDate,
 categoryId,
 status,
 createdAt: initialData?.createdAt || new Date().toISOString()
 };

 if (notes) {
 transactionData.notes = notes;
 } else {
 transactionData.notes = null;
 }

 if (type === 'credit_card' && installments.total > 1) {
 transactionData.installments = installments;
 } else {
 transactionData.installments = null;
 }

 await onSubmit(transactionData);
 onClose();
 } catch (error) {
 console.error('Error saving transaction:', error);
 } finally {
 setIsSubmitting(false);
 }
 };

 const filteredCategories = categories.filter(cat => cat.type === type);

 return (
 <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
 <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
 <div className="p-6 border-b border-neutral-200 flex items-center justify-between shrink-0">
 <h2 className="text-xl font-display font-bold ">{initialData ? 'Editar Registro' : 'Novo Registro'}</h2>
 <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100 :bg-neutral-800 transition-colors ">
 <X size={20} />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
 {error && (
 <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium">
 {error}
 </div>
 )}

 {/* Type Selector */}
 <div className="flex p-1 bg-neutral-100 rounded-2xl">
 {[
 { id: 'revenue', label: 'Receita', icon: <Plus size={16} />, color: 'text-emerald-600' },
 { id: 'expense_fixed', label: 'Fixa', icon: <Minus size={16} />, color: 'text-blue-600' },
 { id: 'expense_variable', label: 'Variável', icon: <Minus size={16} />, color: 'text-red-600' },
 { id: 'credit_card', label: 'Cartão', icon: <CreditCard size={16} />, color: 'text-amber-600' }
 ].map((t) => (
 <button
 key={t.id}
 type="button"
 onClick={() => {
 setType(t.id as TransactionType);
 setCategoryId('');
 }}
 className={cn(
 "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all duration-200",
 type === t.id 
 ? "bg-white shadow-sm text-neutral-900 " 
 : "text-neutral-500 hover:text-neutral-700 :text-neutral-300"
 )}
 >
 <span className={type === t.id ? t.color : ""}>{t.icon}</span>
 {t.label}
 </button>
 ))}
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-sm font-medium text-neutral-500 flex items-center gap-2">
 <FileText size={16} /> Descrição
 </label>
 <input 
 type="text" 
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 className="input" 
 placeholder="Ex: Aluguel, Salário..." 
 required 
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-medium text-neutral-500 flex items-center gap-2">
 <DollarSign size={16} /> Valor
 </label>
 <input 
 type="number" 
 step="0.01"
 min="0.01"
 value={amount}
 onChange={(e) => setAmount(e.target.value)}
 className="input" 
 placeholder="0,00" 
 required 
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-medium text-neutral-500 flex items-center gap-2">
 <Calendar size={16} /> Data
 </label>
 <input 
 type="date" 
 value={date}
 onChange={(e) => setDate(e.target.value)}
 className="input" 
 required 
 />
 </div>

 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <label className="text-sm font-medium text-neutral-500 flex items-center gap-2">
 <Tag size={16} /> Categoria
 </label>
 {onOpenCategories && (
 <button
 type="button"
 onClick={onOpenCategories}
 className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
 >
 <Plus size={14} /> Nova Categoria
 </button>
 )}
 </div>
 <div className="flex flex-wrap gap-2">
 {filteredCategories.map(cat => (
 <button
 key={cat.id}
 type="button"
 onClick={() => setCategoryId(categoryId === cat.id ? '' : cat.id)}
 className={cn(
 "flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all",
 categoryId === cat.id 
 ? "border-primary bg-primary/5 text-primary" 
 : "border-neutral-100 hover:border-neutral-200 :border-neutral-700"
 )}
 >
 <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: cat.color }}>
 <CategoryIcon name={cat.icon} size={12} />
 </div>
 <span className="text-sm font-medium">{cat.name}</span>
 {categoryId === cat.id && (
 <X size={14} className="ml-1 opacity-70 hover:opacity-100" />
 )}
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Status and Installments */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100 ">
 <div className="space-y-2">
 <label className="text-sm font-medium text-neutral-500">Status</label>
 <div className="flex gap-3">
 <button
 type="button"
 onClick={() => setStatus('paid')}
 className={cn(
 "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium border transition-all duration-200",
 status === 'paid' 
 ? "bg-emerald-50 border-emerald-200 text-emerald-700 " 
 : "bg-white border-neutral-200 text-neutral-500"
 )}
 >
 <CheckCircle2 size={16} /> Pago
 </button>
 <button
 type="button"
 onClick={() => setStatus('pending')}
 className={cn(
 "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium border transition-all duration-200",
 status === 'pending' 
 ? "bg-amber-50 border-amber-200 text-amber-700 " 
 : "bg-white border-neutral-200 text-neutral-500"
 )}
 >
 <Clock size={16} /> Pendente
 </button>
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-medium text-neutral-500">Parcelas</label>
 <div className="flex items-center gap-3">
 <input 
 type="number" 
 min="1"
 value={installments.total}
 onChange={(e) => setInstallments({ ...installments, total: Number(e.target.value) })}
 className="input" 
 placeholder="Total" 
 />
 <span className="text-neutral-400">/</span>
 <input 
 type="number" 
 min="1"
 max={installments.total}
 value={installments.current}
 onChange={(e) => setInstallments({ ...installments, current: Number(e.target.value) })}
 className="input" 
 placeholder="Atual" 
 />
 </div>
 </div>
 </div>

 <div className="space-y-2 pt-4 border-t border-neutral-100 ">
 <label className="text-sm font-medium text-neutral-500">Notas (Opcional)</label>
 <textarea
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 className="w-full bg-neutral-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary transition-all resize-none h-24 text-sm"
 placeholder="Adicione observações sobre esta transação..."
 />
 </div>

 <div className="flex gap-3 pt-4 sticky bottom-0 bg-white mt-auto">
 <button type="button" onClick={onClose} className="btn btn-secondary flex-1 py-3 rounded-2xl font-bold">Cancelar</button>
 <button 
 type="submit" 
 disabled={isSubmitting || !categoryId}
 className="btn btn-primary flex-1 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {isSubmitting ? 'Salvando...' : 'Salvar'}
 </button>
 </div>
 </form>
 </div>
 </div>
 );
}
