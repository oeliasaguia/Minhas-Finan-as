/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
 MoreVertical, 
 Edit2, 
 Trash2, 
 CheckCircle2, 
 Clock, 
 ArrowUpCircle, 
 ArrowDownCircle,
 CreditCard,
 Search
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '../utils.ts';
import { Transaction, Category } from '../types.ts';
import { CategoryIcon } from './CategoryManager.tsx';

interface TransactionListProps {
 transactions: Transaction[];
 categories: Category[];
 typeFilter?: string;
 onTypeFilterChange?: (type: any) => void;
 onEdit?: (id: string) => void;
 onDelete?: (id: string) => void;
}

export function TransactionList({ transactions, categories, typeFilter = 'all', onTypeFilterChange, onEdit, onDelete }: TransactionListProps) {
 const [searchTerm, setSearchTerm] = React.useState('');
 const [statusFilter, setStatusFilter] = React.useState<'all' | 'paid' | 'pending'>('all');

 const filtered = transactions.filter(t => {
 const categoryName = categories.find(c => c.id === t.categoryId)?.name || '';
 const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
 categoryName.toLowerCase().includes(searchTerm.toLowerCase());
 const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
 const matchesType = typeFilter === 'all' || t.type === typeFilter;
 return matchesSearch && matchesStatus && matchesType;
 });

 const typeLabels: Record<string, string> = {
 all: 'Tudo',
 revenue: 'Receitas',
 expense_variable: 'Despesas',
 expense_fixed: 'Fixas',
 credit_card: 'Cartão'
 };

 return (
 <div className="space-y-4">
 <div className="card">
 <div className="p-4 md:p-6 border-b border-neutral-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
 <h3 className="font-display font-bold text-lg md:text-xl">Transações</h3>
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
 {onTypeFilterChange && (
 <div className="flex p-1 bg-neutral-100 rounded-2xl w-full sm:w-auto">
 {['all', 'revenue', 'expense_variable', 'expense_fixed', 'credit_card'].map((t) => (
 <button
 key={t}
 onClick={() => onTypeFilterChange(t)}
 className={cn(
 "flex-1 sm:flex-none px-3 py-2 rounded-xl text-[10px] font-bold transition-all",
 typeFilter === t 
 ? "bg-white shadow-sm text-neutral-900 " 
 : "text-neutral-500"
 )}
 >
 {typeLabels[t]}
 </button>
 ))}
 </div>
 )}
 <div className="flex p-1 bg-neutral-100 rounded-2xl w-full sm:w-auto">
 {['all', 'paid', 'pending'].map((s) => (
 <button
 key={s}
 onClick={() => setStatusFilter(s as any)}
 className={cn(
 "flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all",
 statusFilter === s 
 ? "bg-white shadow-sm text-neutral-900 " 
 : "text-neutral-500"
 )}
 >
 {s === 'all' ? 'Tudo' : s === 'paid' ? 'Pago' : 'Pendente'}
 </button>
 ))}
 </div>
 <div className="relative w-full lg:w-72">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
 <input 
 type="text" 
 placeholder="Buscar transações..." 
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-11 pr-4 py-2.5 bg-neutral-100 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
 />
 </div>
 </div>
 </div>

 {/* Mobile Card View */}
 <div className="md:hidden divide-y divide-neutral-100 ">
 {filtered.length === 0 ? (
 <div className="p-12 text-center">
 <p className="text-neutral-500 font-medium">Nenhuma transação encontrada.</p>
 </div>
 ) : (
 filtered.map((transaction) => {
 const category = categories.find(c => c.id === transaction.categoryId);
 return (
 <div key={transaction.id} className="p-4 flex items-center gap-4 active:bg-neutral-50 :bg-neutral-800/50 transition-colors">
 <div className={cn(
 "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
 transaction.type === 'revenue' ? "bg-emerald-50 text-emerald-600 " : 
 transaction.type === 'credit_card' ? "bg-amber-50 text-amber-600 " : "bg-red-50 text-red-600 "
 )}>
 {transaction.type === 'revenue' ? <ArrowUpCircle size={22} /> : 
 transaction.type === 'credit_card' ? <CreditCard size={22} /> : <ArrowDownCircle size={22} />}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between mb-0.5">
 <p className="font-bold truncate text-sm">{transaction.description}</p>
 <p className={cn(
 "font-bold text-sm whitespace-nowrap",
 transaction.type === 'revenue' ? "text-emerald-600" : "text-neutral-900 "
 )}>
 {transaction.type === 'revenue' ? '+' : '-'}{formatCurrency(transaction.amount)}
 </p>
 </div>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category?.color || '#ccc' }} />
 <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 truncate max-w-[80px]">
 {category?.name || 'Sem Categoria'}
 </span>
 <span className="text-[10px] font-medium text-neutral-400">
 {formatDate(transaction.date)}
 </span>
 </div>
 <div className="flex items-center gap-1">
 <button 
 onClick={() => onEdit?.(transaction.id)}
 className="p-2 text-neutral-400 hover:text-primary transition-colors"
 >
 <Edit2 size={16} />
 </button>
 <button 
 onClick={() => onDelete?.(transaction.id)}
 className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
 >
 <Trash2 size={16} />
 </button>
 </div>
 </div>
 </div>
 </div>
 );
 })
 )}
 </div>

 {/* Desktop Table View */}
 <div className="hidden md:block overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="text-xs text-neutral-500 uppercase tracking-wider border-b border-neutral-200 ">
 <th className="px-6 py-4 font-medium">Data</th>
 <th className="px-6 py-4 font-medium">Descrição</th>
 <th className="px-6 py-4 font-medium">Categoria</th>
 <th className="px-6 py-4 font-medium">Status</th>
 <th className="px-6 py-4 font-medium text-right">Valor</th>
 <th className="px-6 py-4 font-medium text-right">Ações</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-neutral-200 ">
 {filtered.map((transaction) => {
 const category = categories.find(c => c.id === transaction.categoryId);
 
 return (
 <tr key={transaction.id} className="hover:bg-neutral-50 :bg-neutral-800/50 transition-colors group">
 <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
 {formatDate(transaction.date)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="flex items-center gap-3">
 <div className={cn(
 "w-8 h-8 rounded-lg flex items-center justify-center",
 transaction.type === 'revenue' ? "bg-emerald-50 text-emerald-600" : 
 transaction.type === 'credit_card' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
 )}>
 {transaction.type === 'revenue' ? <ArrowUpCircle size={16} /> : 
 transaction.type === 'credit_card' ? <CreditCard size={16} /> : <ArrowDownCircle size={16} />}
 </div>
 <div>
 <p className="text-sm font-medium">{transaction.description}</p>
 {transaction.installments && (
 <p className="text-[10px] font-bold text-primary uppercase tracking-wider mt-0.5">
 Parcela {transaction.installments.current}/{transaction.installments.total}
 </p>
 )}
 </div>
 </div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: category?.color || '#ccc' }}>
 <CategoryIcon name={category?.icon || 'Tag'} size={12} />
 </div>
 <span className="text-xs font-medium text-neutral-600 ">
 {category?.name || 'Sem Categoria'}
 </span>
 </div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <div className={cn(
 "flex items-center gap-1.5 text-xs font-medium",
 transaction.status === 'paid' ? "text-emerald-600" : "text-amber-600"
 )}>
 {transaction.status === 'paid' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
 {transaction.status === 'paid' ? 'Pago' : 'Pendente'}
 </div>
 </td>
 <td className={cn(
 "px-6 py-4 whitespace-nowrap text-sm font-bold text-right",
 transaction.type === 'revenue' ? "text-emerald-600" : "text-neutral-900 "
 )}>
 {transaction.type === 'revenue' ? '+' : '-'} {formatCurrency(transaction.amount)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-right">
 <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <button 
 onClick={() => onEdit?.(transaction.id)}
 className="p-1.5 rounded-lg hover:bg-neutral-100 :bg-neutral-800 text-neutral-500 hover:text-primary transition-colors"
 >
 <Edit2 size={16} />
 </button>
 <button 
 onClick={() => onDelete?.(transaction.id)}
 className="p-1.5 rounded-lg hover:bg-neutral-100 :bg-neutral-800 text-neutral-500 hover:text-red-500 transition-colors"
 >
 <Trash2 size={16} />
 </button>
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
