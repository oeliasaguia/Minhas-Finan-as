import React from 'react';
import { Goal } from '../types.ts';
import { financeService } from '../services/financeService.ts';
import { CategoryIcon } from './CategoryManager.tsx';
import { Plus, Trash2, Target, Calendar, Palette, Type, DollarSign, Edit2 } from 'lucide-react';
import { formatCurrency } from '../utils.ts';

interface GoalManagerProps {
 userId: string;
 goals: Goal[];
 onClose: () => void;
}

const ICONS = ['Target', 'Home', 'Car', 'Plane', 'Smartphone', 'Laptop', 'Heart', 'GraduationCap', 'Briefcase', 'ShoppingBag', 'Coffee', 'Gift'];
const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export function GoalManager({ userId, goals, onClose }: GoalManagerProps) {
 const [isAdding, setIsAdding] = React.useState(false);
 const [editingId, setEditingId] = React.useState<string | null>(null);
 const [isSubmitting, setIsSubmitting] = React.useState(false);
 const [name, setName] = React.useState('');
 const [targetAmount, setTargetAmount] = React.useState('');
 const [currentAmount, setCurrentAmount] = React.useState('0');
 const [deadline, setDeadline] = React.useState('');
 const [icon, setIcon] = React.useState('Target');
 const [color, setColor] = React.useState('#10B981');

 React.useEffect(() => {
 if (editingId) {
 const goal = goals.find(g => g.id === editingId);
 if (goal) {
 setName(goal.name);
 setTargetAmount(goal.targetAmount.toString());
 setCurrentAmount(goal.currentAmount.toString());
 setDeadline(goal.deadline || '');
 setIcon(goal.icon);
 setColor(goal.color);
 setIsAdding(true);
 }
 }
 }, [editingId, goals]);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!name || !targetAmount) return;

 setIsSubmitting(true);
 try {
 const goalData: any = {
 name,
 targetAmount: parseFloat(targetAmount),
 currentAmount: parseFloat(currentAmount),
 icon,
 color,
 status: 'active' as const
 };

 if (deadline) {
 goalData.deadline = deadline.includes('T') ? deadline : `${deadline}T12:00:00Z`;
 } else {
 goalData.deadline = null;
 }

 if (editingId) {
 await financeService.updateGoal(userId, editingId, goalData);
 setEditingId(null);
 } else {
 await financeService.addGoal(userId, goalData);
 }

 setName('');
 setTargetAmount('');
 setCurrentAmount('0');
 setDeadline('');
 setIsAdding(false);
 } catch (error) {
 console.error('Error saving goal:', error);
 } finally {
 setIsSubmitting(false);
 }
 };

 const handleDelete = async (id: string) => {
 if (confirm('Tem certeza que deseja excluir esta meta?')) {
 await financeService.deleteGoal(userId, id);
 }
 };

 return (
 <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
 <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
 <div className="p-6 border-b border-neutral-200 flex items-center justify-between shrink-0">
 <h2 className="text-xl font-display font-bold ">Minhas Metas</h2>
 <button 
 onClick={onClose}
 className="p-2 hover:bg-neutral-100 :bg-neutral-800 rounded-xl transition-colors "
 >
 <Plus className="rotate-45" size={24} />
 </button>
 </div>

 <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
 {isAdding ? (
 <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-50 p-6 rounded-2xl border border-neutral-100 ">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
 <Type size={14} /> Nome da Meta
 </label>
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 className="w-full bg-white border-none rounded-xl p-3 focus:ring-2 focus:ring-primary transition-all"
 placeholder="Ex: Viagem para Europa"
 required
 />
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
 <Target size={14} /> Valor Alvo
 </label>
 <input
 type="number"
 value={targetAmount}
 onChange={(e) => setTargetAmount(e.target.value)}
 className="w-full bg-white border-none rounded-xl p-3 focus:ring-2 focus:ring-primary transition-all"
 placeholder="0,00"
 required
 />
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
 <DollarSign size={14} /> Valor Atual
 </label>
 <input
 type="number"
 value={currentAmount}
 onChange={(e) => setCurrentAmount(e.target.value)}
 className="w-full bg-white border-none rounded-xl p-3 focus:ring-2 focus:ring-primary transition-all"
 placeholder="0,00"
 />
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
 <Calendar size={14} /> Prazo (Opcional)
 </label>
 <input
 type="date"
 value={deadline}
 onChange={(e) => setDeadline(e.target.value)}
 className="w-full bg-white border-none rounded-xl p-3 focus:ring-2 focus:ring-primary transition-all"
 />
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
 <Palette size={14} /> Cor
 </label>
 <div className="flex flex-wrap gap-2">
 {COLORS.map(c => (
 <button
 key={c}
 type="button"
 onClick={() => setColor(c)}
 className={`w-8 h-8 rounded-lg transition-all ${color === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'opacity-70 hover:opacity-100'}`}
 style={{ backgroundColor: c }}
 />
 ))}
 </div>
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Ícone</label>
 <div className="flex flex-wrap gap-3">
 {ICONS.map(i => (
 <button
 key={i}
 type="button"
 onClick={() => setIcon(i)}
 className={`p-3 rounded-xl transition-all ${icon === i ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-white text-neutral-400 hover:bg-neutral-100 :bg-neutral-800'}`}
 >
 <CategoryIcon name={i} size={20} />
 </button>
 ))}
 </div>
 </div>

 <div className="flex gap-3 pt-4">
 <button
 type="submit"
 disabled={isSubmitting}
 className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
 >
 {isSubmitting && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
 <span>{isSubmitting ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Salvar Meta')}</span>
 </button>
 <button
 type="button"
 onClick={() => {
 setIsAdding(false);
 setEditingId(null);
 }}
 className="px-6 bg-neutral-200 text-neutral-600 font-bold rounded-xl hover:bg-neutral-300 :bg-neutral-600 transition-all"
 >
 Cancelar
 </button>
 </div>
 </form>
 ) : (
 <button
 onClick={() => setIsAdding(true)}
 className="w-full p-6 border-2 border-dashed border-neutral-200 rounded-3xl flex flex-col items-center gap-2 text-neutral-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group"
 >
 <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
 <Plus size={24} />
 </div>
 <span className="font-bold">Adicionar Nova Meta</span>
 </button>
 )}

 <div className="space-y-4">
 <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Metas Ativas</h3>
 <div className="grid grid-cols-1 gap-4">
 {goals.map(goal => {
 const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
 return (
 <div key={goal.id} className="card p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 group relative">
 <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg" style={{ backgroundColor: goal.color }}>
 <CategoryIcon name={goal.icon} size={24} className="md:hidden" />
 <CategoryIcon name={goal.icon} size={28} className="hidden md:block" />
 </div>
 <div className="flex-1 min-w-0 w-full">
 <div className="flex items-center justify-between mb-1">
 <h4 className="font-bold truncate text-sm md:text-base">{goal.name}</h4>
 <span className="text-xs md:text-sm font-bold text-primary">{progress.toFixed(0)}%</span>
 </div>
 <div className="flex flex-col sm:flex-row sm:justify-between text-[10px] md:text-xs text-neutral-500 mb-3 gap-1">
 <span>{formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}</span>
 {goal.deadline && (
 <span className="flex items-center gap-1">
 <Calendar size={12} /> {new Date(goal.deadline).toLocaleDateString()}
 </span>
 )}
 </div>
 <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
 <div 
 className="h-full bg-primary transition-all duration-1000"
 style={{ width: `${progress}%` }}
 />
 </div>
 </div>
 <div className="flex items-center gap-1 absolute top-4 right-4 sm:static sm:opacity-0 sm:group-hover:opacity-100 transition-all">
 <button
 onClick={() => setEditingId(goal.id)}
 className="p-2 text-neutral-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
 >
 <Edit2 size={18} />
 </button>
 <button
 onClick={() => handleDelete(goal.id)}
 className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 :bg-red-900/20 rounded-xl transition-all"
 >
 <Trash2 size={18} />
 </button>
 </div>
 </div>
 );
 })}
 {goals.length === 0 && !isAdding && (
 <div className="text-center py-12 text-neutral-400">
 <Target size={48} className="mx-auto mb-4 opacity-20" />
 <p>Você ainda não tem metas definidas.</p>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
