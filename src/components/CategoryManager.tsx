/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
 Plus, Trash2, Edit2, X, Tag, Palette, LayoutGrid, 
 ShoppingBag, Coffee, Car, Home, Smartphone, Heart, Plane, Briefcase, DollarSign,
 Utensils, Wifi, Zap, Fuel, ShieldCheck, GraduationCap, Ticket, HeartPulse, CreditCard,
 Bike, Bus, Train, Dumbbell, Stethoscope, Pill, Baby, Dog, Cat, Shirt, Scissors,
 Gamepad2, Music, Tv, Book, Wrench, Droplet, Flame, Gift, ShoppingCart, Camera, Umbrella
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
 Tag, ShoppingBag, Coffee, Car, Home, Smartphone, Heart, Plane, Briefcase, DollarSign,
 Utensils, Wifi, Zap, Fuel, ShieldCheck, GraduationCap, Ticket, HeartPulse, CreditCard,
 Bike, Bus, Train, Dumbbell, Stethoscope, Pill, Baby, Dog, Cat, Shirt, Scissors,
 Gamepad2, Music, Tv, Book, Wrench, Droplet, Flame, Gift, ShoppingCart, Camera, Umbrella
};

export function CategoryIcon({ name, size = 16, className }: { name: string; size?: number; className?: string }) {
 const Icon = ICON_MAP[name] || Tag;
 return <Icon size={size} className={className} />;
}
import { Category, TransactionType, Transaction } from '../types.ts';
import { DEFAULT_CATEGORIES } from '../constants.ts';
import { cn, formatCurrency } from '../utils.ts';
import { ConfirmModal } from './ConfirmModal.tsx';

interface CategoryManagerProps {
 isOpen: boolean;
 onClose: () => void;
 categories: Category[];
 transactions: Transaction[];
 onAdd: (category: Omit<Category, 'id'>) => void;
 onUpdate: (id: string, category: Partial<Category>) => void;
 onDelete: (id: string) => void;
}

export function CategoryManager({ isOpen, onClose, categories, transactions, onAdd, onUpdate, onDelete }: CategoryManagerProps) {
 const [editingId, setEditingId] = React.useState<string | null>(null);
 const [name, setName] = React.useState('');
 const [type, setType] = React.useState<TransactionType>('expense_variable');
 const [color, setColor] = React.useState('#10B981');
 const [icon, setIcon] = React.useState('Tag');
 const [budget, setBudget] = React.useState('');
 const [isSubmitting, setIsSubmitting] = React.useState(false);
 const [deletingId, setDeletingId] = React.useState<string | null>(null);
 const [error, setError] = React.useState<string | null>(null);

 const handleDeleteRequest = (id: string) => {
 const hasTransactions = transactions.some(t => t.categoryId === id);
 if (hasTransactions) {
 setError('Não é possível excluir uma categoria que possui transações. Reatribua as transações primeiro.');
 return;
 }
 setDeletingId(id);
 };

 const handleConfirmDelete = async () => {
 if (deletingId) {
 await onDelete(deletingId);
 setDeletingId(null);
 }
 };

 const getCategoryTotal = (categoryId: string) => {
 return transactions
 .filter(t => t.categoryId === categoryId)
 .reduce((acc, t) => acc + t.amount, 0);
 };

 React.useEffect(() => {
 if (editingId) {
 const cat = categories.find(c => c.id === editingId);
 if (cat) {
 setName(cat.name);
 setType(cat.type);
 setColor(cat.color);
 setIcon(cat.icon);
 setBudget(cat.budget?.toString() || '');
 }
 } else {
 setName('');
 setType('expense_variable');
 setColor('#10B981');
 setIcon('Tag');
 setBudget('');
 }
 }, [editingId, categories]);

 if (!isOpen) return null;

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsSubmitting(true);
 try {
 const categoryData: any = {
 name,
 type,
 color,
 icon
 };

 if (budget) {
 categoryData.budget = Number(budget);
 } else {
 categoryData.budget = null;
 }

 if (editingId) {
 await onUpdate(editingId, categoryData);
 setEditingId(null);
 } else {
 await onAdd(categoryData);
 }
 setName('');
 setBudget('');
 } catch (error) {
 console.error('Error saving category:', error);
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
 <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
 <div className="p-6 border-b border-neutral-200 flex items-center justify-between shrink-0">
 <h2 className="text-xl font-display font-bold ">Gerenciar Categorias</h2>
 <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100 :bg-neutral-800 transition-colors ">
 <X size={20} />
 </button>
 </div>

 <div className="flex flex-col md:grid md:grid-cols-2 overflow-hidden h-[80vh] md:h-auto">
 {/* Form Section - On top for mobile */}
 <div className="p-6 bg-neutral-50/50 border-b md:border-b-0 md:border-r border-neutral-200 order-1 md:order-2 overflow-y-auto">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">{editingId ? 'Editar Categoria' : 'Nova Categoria'}</h3>
 {editingId && (
 <button 
 onClick={() => setEditingId(null)}
 className="text-xs font-bold text-primary hover:underline"
 >
 Cancelar Edição
 </button>
 )}
 </div>
 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="space-y-2">
 <label className="text-sm font-medium text-neutral-500">Nome</label>
 <input 
 type="text" 
 value={name}
 onChange={(e) => setName(e.target.value)}
 className="input" 
 placeholder="Ex: Alimentação..." 
 required 
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-medium text-neutral-500">Tipo</label>
 <select 
 value={type}
 onChange={(e) => setType(e.target.value as TransactionType)}
 className="input font-bold"
 >
 <option value="revenue">Receita</option>
 <option value="expense_fixed">Despesa Fixa</option>
 <option value="expense_variable">Despesa Variável</option>
 <option value="credit_card">Cartão de Crédito</option>
 </select>
 </div>

 {type !== 'revenue' && (
 <div className="space-y-2">
 <label className="text-sm font-medium text-neutral-500">Orçamento Mensal (Opcional)</label>
 <input 
 type="number" 
 value={budget}
 onChange={(e) => setBudget(e.target.value)}
 className="input" 
 placeholder="Ex: 500.00" 
 />
 </div>
 )}

 <div className="space-y-2">
 <label className="text-sm font-medium text-neutral-500">Ícone</label>
 <div className="flex flex-wrap gap-2">
 {Object.keys(ICON_MAP).map((i) => (
 <button
 key={i}
 type="button"
 onClick={() => setIcon(i)}
 className={cn(
 "w-9 h-9 md:w-8 md:h-8 rounded-xl border-2 transition-all duration-200 flex items-center justify-center",
 icon === i ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-neutral-100 "
 )}
 >
 <CategoryIcon name={i} size={16} />
 </button>
 ))}
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-medium text-neutral-500">Cor</label>
 <div className="flex flex-wrap gap-2">
 {['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#374151'].map((c) => (
 <button
 key={c}
 type="button"
 onClick={() => setColor(c)}
 className={cn(
 "w-9 h-9 md:w-8 md:h-8 rounded-full border-2 transition-all duration-200",
 color === c ? "border-neutral-900 scale-110" : "border-transparent"
 )}
 style={{ backgroundColor: c }}
 />
 ))}
 </div>
 </div>

 <button 
 type="submit" 
 disabled={isSubmitting}
 className="w-full btn btn-primary py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 gap-2 disabled:opacity-50"
 >
 {isSubmitting ? (
 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
 ) : (
 <Plus size={18} />
 )}
 <span>{isSubmitting ? (editingId ? 'Salvando...' : 'Adicionando...') : (editingId ? 'Salvar Alterações' : 'Adicionar Categoria')}</span>
 </button>
 </form>
 </div>

 {/* List Section */}
 <div className="p-6 overflow-y-auto order-2 md:order-1 h-full">
 <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">Suas Categorias</h3>
 {error && (
 <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium flex justify-between items-center">
 {error}
 <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-lg">
 <X size={14} />
 </button>
 </div>
 )}
 <div className="space-y-2">
 {categories.map((cat) => (
 <div key={cat.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-neutral-50 group border border-transparent hover:border-neutral-200 :border-neutral-700 transition-all gap-3 sm:gap-0">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0" style={{ backgroundColor: cat.color }}>
 <CategoryIcon name={cat.icon} size={18} />
 </div>
 <div className="min-w-0">
 <p className="text-sm font-bold truncate">{cat.name}</p>
 <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 truncate">{cat.type}</p>
 </div>
 </div>
 <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
 <div className="text-left sm:text-right">
 <p className="text-sm font-bold">{formatCurrency(getCategoryTotal(cat.id))}</p>
 <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Total</p>
 </div>
 <div className="flex items-center gap-1 shrink-0">
 <button 
 onClick={() => setEditingId(cat.id)}
 className="p-2 rounded-xl hover:bg-primary/10 text-primary transition-all"
 >
 <Edit2 size={18} />
 </button>
 <button 
 onClick={() => handleDeleteRequest(cat.id)}
 className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-all"
 >
 <Trash2 size={18} />
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 <ConfirmModal 
 isOpen={!!deletingId}
 onClose={() => setDeletingId(null)}
 onConfirm={handleConfirmDelete}
 title="Excluir Categoria"
 message="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
 />
 </div>
 );
}
