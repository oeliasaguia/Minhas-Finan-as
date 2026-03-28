/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
 TrendingUp, 
 TrendingDown, 
 DollarSign, 
 Plus, 
 Filter, 
 Download,
 Calendar,
 CreditCard,
 ArrowUpRight,
 ArrowDownRight,
 Zap,
 Tag,
 Target,
 Settings
} from 'lucide-react';
import { 
 BarChart, 
 Bar, 
 XAxis, 
 YAxis, 
 CartesianGrid, 
 Tooltip, 
 ResponsiveContainer,
 PieChart,
 Pie,
 Cell,
 LineChart,
 Line,
 AreaChart,
 Area
} from 'recharts';
import { formatCurrency, cn } from '../utils.ts';

import { Transaction, Category, UserProfile, Goal } from '../types.ts';
import { CategoryIcon } from './CategoryManager.tsx';

import domtoimage from 'dom-to-image';

import { MONTHS } from '../constants.ts';

interface DashboardProps {
 transactions: Transaction[];
 categories: Category[];
 goals: Goal[];
 user: UserProfile | null;
 currentMonth: number;
 currentYear: number;
 onMonthChange: (month: number) => void;
 onYearChange: (year: number) => void;
 onAddTransaction: (type: Transaction['type']) => void;
 onOpenCategories: () => void;
 onOpenGoals: () => void;
}

export function Dashboard({ 
 transactions, 
 categories,
 goals,
 user,
 currentMonth, 
 currentYear, 
 onMonthChange, 
 onYearChange,
 onAddTransaction,
 onOpenCategories,
 onOpenGoals
}: DashboardProps) {
 const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

 const exportToImage = () => {
 const dashboardElement = document.getElementById('dashboard-content');
 if (!dashboardElement) return;

 domtoimage.toPng(dashboardElement, { bgcolor: '#ffffff' })
 .then((dataUrl) => {
 const link = document.createElement('a');
 link.download = `relatorio_financeiro_${new Date().toISOString().split('T')[0]}.png`;
 link.href = dataUrl;
 link.click();
 })
 .catch((error) => {
 console.error('oops, something went wrong!', error);
 alert('Erro ao gerar a imagem do relatório.');
 });
 };

 const totalRevenue = transactions
 .filter(t => t.type === 'revenue')
 .reduce((acc, t) => acc + t.amount, 0);
 
 const totalExpenses = transactions
 .filter(t => t.type !== 'revenue')
 .reduce((acc, t) => acc + t.amount, 0);
 
 const balance = totalRevenue - totalExpenses;
 
 const creditCardExpenses = transactions
 .filter(t => t.type === 'credit_card')
 .reduce((acc, t) => acc + t.amount, 0);

 const totalBudget = categories
 .filter(c => c.type !== 'revenue' && c.budget)
 .reduce((acc, c) => acc + (c.budget || 0), 0);

 const budgetUsage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

 const expensesByCategory = categories
 .filter(c => c.type !== 'revenue')
 .map(cat => {
 const value = transactions
 .filter(t => t.categoryId === cat.id)
 .reduce((acc, t) => acc + t.amount, 0);
 return { 
 name: cat.name, 
 value, 
 color: cat.color,
 icon: cat.icon,
 budget: cat.budget 
 };
 })
 .filter(c => c.value > 0 || (c.budget && c.budget > 0))
 .sort((a, b) => b.value - a.value);

 const greeting = () => {
 const hour = new Date().getHours();
 if (hour < 12) return 'Bom dia';
 if (hour < 18) return 'Boa tarde';
 return 'Boa noite';
 };

 return (
 <div id="dashboard-content" className="space-y-8">
 {/* Header */}
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
 <div>
 <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">
 {greeting()}, {user?.displayName.split(' ')[0] || 'Usuário'}!
 </h1>
 <p className="text-sm md:text-base text-neutral-500">Aqui está o resumo das suas finanças.</p>
 </div>
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
 <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-2xl">
 <select 
 value={currentMonth}
 onChange={(e) => onMonthChange(Number(e.target.value))}
 className="flex-1 bg-transparent text-sm font-bold px-3 py-1.5 focus:outline-none appearance-none cursor-pointer"
 >
 {MONTHS.map((month, i) => (
 <option key={month} value={i}>{month}</option>
 ))}
 </select>
 <div className="w-px h-4 bg-neutral-300 " />
 <select 
 value={currentYear}
 onChange={(e) => onYearChange(Number(e.target.value))}
 className="flex-1 bg-transparent text-sm font-bold px-3 py-1.5 focus:outline-none appearance-none cursor-pointer"
 >
 {years.map(year => (
 <option key={year} value={year}>{year}</option>
 ))}
 </select>
 </div>
 <div className="flex gap-2">
 <button onClick={exportToImage} className="flex-1 sm:flex-none btn btn-secondary gap-2 py-2.5 px-4 rounded-2xl">
 <Download size={18} />
 <span className="text-sm font-bold">Gerar Imagem do Relatório</span>
 </button>
 </div>
 </div>
 </div>

 {/* Quick Actions */}
 <div className="flex justify-center">
 <button 
 onClick={() => onAddTransaction('expense_variable')}
 className="btn btn-primary gap-2 py-3 px-8 shadow-lg shadow-primary/20 whitespace-nowrap"
 >
 <Plus size={18} className="shrink-0" />
 <span className="text-sm md:text-base font-bold">Novo Registro</span>
 </button>
 </div>

 {/* Summary Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
 <SummaryCard 
 title="Saldo Total" 
 value={balance} 
 icon={<DollarSign size={24} />}
 trend={balance >= 0 ? "+12%" : "-5%"}
 trendUp={balance >= 0}
 color={balance >= 0 ? "emerald" : "danger"}
 />
 <SummaryCard 
 title="Receitas" 
 value={totalRevenue} 
 icon={<TrendingUp size={24} />}
 trend="+5%"
 trendUp={true}
 color="blue"
 />
 <SummaryCard 
 title="Despesas" 
 value={totalExpenses} 
 icon={<TrendingDown size={24} />}
 trend="+18%"
 trendUp={false}
 color="danger"
 />
 <SummaryCard 
 title="Cartão de Crédito" 
 value={creditCardExpenses} 
 icon={<CreditCard size={24} />}
 trend="-2%"
 trendUp={true}
 color="orange"
 />
 <SummaryCard 
 title="Orçamento Total" 
 value={totalBudget} 
 icon={<Zap size={24} />}
 trend={`${budgetUsage.toFixed(0)}% usado`}
 trendUp={budgetUsage <= 100}
 color="blue"
 />
 </div>

 {/* Charts Section */}
 <div className="grid grid-cols-1 gap-6">
 {/* Category Pie Chart */}
 <div className="card p-6">
 <h3 className="font-display font-bold text-lg mb-6">Despesas por Categoria</h3>
 <div className="h-[300px] w-full">
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={expensesByCategory}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={80}
 paddingAngle={5}
 dataKey="value"
 >
 {expensesByCategory.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip 
 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
 formatter={(value: number) => formatCurrency(value)}
 />
 </PieChart>
 </ResponsiveContainer>
 </div>
 <div className="space-y-4 mt-4">
 {expensesByCategory.map((item) => {
 const budgetPercentage = item.budget ? Math.min((item.value / item.budget) * 100, 100) : null;
 
 return (
 <div key={item.name} className="space-y-1.5">
 <div className="flex items-center justify-between text-sm">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
 <CategoryIcon name={item.icon} size={12} />
 </div>
 <span className="text-neutral-600 font-medium">{item.name}</span>
 </div>
 <span className="font-bold">{formatCurrency(item.value)}</span>
 </div>
 {item.budget && (
 <div className="space-y-1">
 <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
 <div 
 className={cn(
 "h-full transition-all duration-500",
 budgetPercentage && budgetPercentage > 90 ? "bg-red-500" : "bg-primary"
 )}
 style={{ width: `${budgetPercentage}%` }}
 />
 </div>
 <div className="flex justify-between text-[10px] text-neutral-400">
 <span>Orçamento: {formatCurrency(item.budget)}</span>
 <span>{budgetPercentage?.toFixed(0)}%</span>
 </div>
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Goals Section */}
 {goals.length > 0 && (
 <div className="space-y-4">
 <h3 className="font-display font-bold text-lg">Metas Financeiras</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {goals.map(goal => {
 const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
 return (
 <div key={goal.id} className="card p-6">
 <div className="flex items-center justify-between mb-4">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: goal.color }}>
 <CategoryIcon name={goal.icon} size={20} />
 </div>
 <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
 {progress.toFixed(0)}%
 </span>
 </div>
 <h4 className="font-bold mb-1">{goal.name}</h4>
 <div className="flex justify-between text-sm mb-3">
 <span className="text-neutral-500">{formatCurrency(goal.currentAmount)}</span>
 <span className="font-bold">{formatCurrency(goal.targetAmount)}</span>
 </div>
 <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
 <div 
 className="h-full bg-primary transition-all duration-1000"
 style={{ width: `${progress}%` }}
 />
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}
 </div>
 );
}

interface SummaryCardProps {
 title: string;
 value: number;
 icon: React.ReactNode;
 trend: string;
 trendUp: boolean;
 color: 'primary' | 'secondary' | 'danger' | 'accent' | 'emerald' | 'blue' | 'orange';
}

function SummaryCard({ title, value, icon, trend, trendUp, color }: SummaryCardProps) {
 const colorClasses = {
 primary: 'bg-primary/10 text-primary',
 secondary: 'bg-secondary/10 text-secondary',
 danger: 'bg-red-500/10 text-red-500',
 accent: 'bg-accent/10 text-accent',
 emerald: 'bg-emerald-500/10 text-emerald-500',
 blue: 'bg-blue-500/10 text-blue-500',
 orange: 'bg-orange-500/10 text-orange-500',
 };

 return (
 <div className="card p-5 md:p-6">
 <div className="flex items-center justify-between mb-4">
 <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center", colorClasses[color])}>
 {React.cloneElement(icon as React.ReactElement, { size: 20, className: "md:hidden" })}
 {React.cloneElement(icon as React.ReactElement, { size: 24, className: "hidden md:block" })}
 </div>
 <div className={cn(
 "flex items-center gap-1 text-[10px] md:text-xs font-bold px-2 py-1 rounded-full",
 trendUp ? "bg-emerald-50 text-emerald-600 " : "bg-red-50 text-red-600 "
 )}>
 {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
 {trend}
 </div>
 </div>
 <p className="text-xs md:text-sm text-neutral-500 font-medium">{title}</p>
 <h2 className="text-xl md:text-2xl font-display font-bold mt-1 truncate">{formatCurrency(value)}</h2>
 </div>
 );
}
