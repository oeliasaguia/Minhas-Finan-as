/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, loginWithGoogle, logout } from './firebase.ts';
import { financeService } from './services/financeService.ts';
import { Transaction, Category, UserProfile, Goal, TransactionType } from './types.ts';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { Auth } from './components/Auth.tsx';
import { TransactionList } from './components/TransactionList.tsx';
import { TransactionForm } from './components/TransactionForm.tsx';
import { CategoryManager } from './components/CategoryManager.tsx';
import { GoalManager } from './components/GoalManager.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { Plus, Tag, Settings, Clock, Target } from 'lucide-react';
import { formatCurrency, formatDate } from './utils.ts';

import { getFinanceAdvice } from './services/geminiService.ts';

import { ConfirmModal } from './components/ConfirmModal.tsx';

export default function App() {
 const [user, setUser] = React.useState<User | null>(null);
 const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
 const [isAuthReady, setIsAuthReady] = React.useState(false);
 const [isLoading, setIsLoading] = React.useState(true);
 const [transactions, setTransactions] = React.useState<Transaction[]>([]);
 const [categories, setCategories] = React.useState<Category[]>([]);
 const [goals, setGoals] = React.useState<Goal[]>([]);
 const [isTransactionFormOpen, setIsTransactionFormOpen] = React.useState(false);
 const [isCategoryManagerOpen, setIsCategoryManagerOpen] = React.useState(false);
 const [isGoalManagerOpen, setIsGoalManagerOpen] = React.useState(false);
 const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
 const [initialType, setInitialType] = React.useState<TransactionType>('expense_variable');
 const [deletingTransactionId, setDeletingTransactionId] = React.useState<string | null>(null);
 const [advice, setAdvice] = React.useState<string>('Carregando conselhos...');
 const [isSeeding, setIsSeeding] = React.useState(false);
 const [isLoggingIn, setIsLoggingIn] = React.useState(false);
 const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
 const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
 const [typeFilter, setTypeFilter] = React.useState<TransactionType | 'all'>('all');

 React.useEffect(() => {
 document.documentElement.classList.remove('dark');
 }, []);

 const filteredTransactions = transactions.filter(t => {
 const d = new Date(t.date);
 const matchesMonth = d.getMonth() === currentMonth && d.getFullYear() === currentYear;
 const matchesType = typeFilter === 'all' || t.type === typeFilter;
 return matchesMonth && matchesType;
 });

 React.useEffect(() => {
 if (transactions.length > 0) {
 getFinanceAdvice(transactions).then(setAdvice);
 }
 }, [transactions]);

 React.useEffect(() => {
 const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
 setUser(currentUser);
 setIsAuthReady(true);
 
 if (currentUser) {
 try {
 // Check if user profile exists, if not create it and seed data
 let profile = await financeService.getUserProfile(currentUser.uid);
 if (!profile) {
 profile = {
 uid: currentUser.uid,
 email: currentUser.email || '',
 displayName: currentUser.displayName || 'Usuário',
 photoURL: currentUser.photoURL || '',
 currency: 'BRL',
 theme: 'light'
 };
 await financeService.createUserProfile(profile);
 // Seed initial data provided in the prompt
 await seedInitialData(currentUser.uid);
 }
 setUserProfile(profile);

 // Subscribe to data
 const unsubTransactions = financeService.subscribeToTransactions(currentUser.uid, setTransactions);
 const unsubCategories = financeService.subscribeToCategories(currentUser.uid, setCategories);
 const unsubGoals = financeService.subscribeToGoals(currentUser.uid, setGoals);
 
 setIsLoading(false);
 return () => {
 unsubTransactions();
 unsubCategories();
 unsubGoals();
 };
 } catch (error) {
 console.error("Error initializing user data:", error);
 setIsLoading(false);
 }
 } else {
 setUserProfile(null);
 setIsLoading(false);
 }
 });

 return () => unsubscribe();
 }, []);

 const seedInitialData = async (userId: string) => {
 setIsSeeding(true);
 
 // Seed Categories first
 const initialCategories: Omit<Category, 'id'>[] = [
 { name: 'Salário', icon: 'Wallet', color: '#10b981', type: 'revenue' },
 { name: 'Freelance', icon: 'Code', color: '#8b5cf6', type: 'revenue' },
 { name: 'Vale Alimentação', icon: 'Utensils', color: '#f59e0b', type: 'revenue' },
 { name: 'Internet/Celular', icon: 'Wifi', color: '#3b82f6', type: 'expense_fixed' },
 { name: 'Energia', icon: 'Zap', color: '#eab308', type: 'expense_fixed' },
 { name: 'Transporte', icon: 'Car', color: '#ef4444', type: 'expense_fixed' },
 { name: 'Empréstimos/Seguros', icon: 'ShieldCheck', color: '#6366f1', type: 'expense_fixed' },
 { name: 'Educação', icon: 'GraduationCap', color: '#ec4899', type: 'expense_fixed' },
 { name: 'Lazer/Variáveis', icon: 'Smile', color: '#f97316', type: 'expense_variable' },
 { name: 'Cartão de Crédito', icon: 'CreditCard', color: '#64748b', type: 'credit_card' }
 ];

 const categoryMap: Record<string, string> = {};
 
 // Use fixed IDs for seeding consistency with transactions if possible, 
 // but since addCategory uses addDoc, I'll map them.
 // Actually, I'll use setDoc with fixed IDs for seeding to match the transaction categoryIds.
 
 const seedCategories: Category[] = [
 { id: 'cat-1', name: 'Salário', icon: 'Wallet', color: '#10b981', type: 'revenue' },
 { id: 'cat-2', name: 'Freelance', icon: 'Code', color: '#8b5cf6', type: 'revenue' },
 { id: 'cat-3', name: 'Vale Alimentação', icon: 'Utensils', color: '#f59e0b', type: 'revenue' },
 { id: 'cat-4', name: 'Internet/Celular', icon: 'Wifi', color: '#3b82f6', type: 'expense_fixed' },
 { id: 'cat-5', name: 'Energia', icon: 'Zap', color: '#eab308', type: 'expense_fixed' },
 { id: 'cat-6', name: 'Transporte', icon: 'Car', color: '#ef4444', type: 'expense_variable' },
 { id: 'cat-7', name: 'Empréstimos/Seguros', icon: 'ShieldCheck', color: '#6366f1', type: 'expense_fixed' },
 { id: 'cat-8', name: 'Educação', icon: 'GraduationCap', color: '#ec4899', type: 'expense_fixed' },
 { id: 'cat-9', name: 'Lazer/Variáveis', icon: 'Smile', color: '#f97316', type: 'expense_variable' },
 { id: 'cat-11', name: 'Cartão de Crédito', icon: 'CreditCard', color: '#64748b', type: 'credit_card' }
 ];

 for (const cat of seedCategories) {
 await financeService.addCategoryWithId(userId, cat.id, cat);
 }

 // Revenues
 const revenues = [
 { description: 'Salário', amount: 6525.00, type: 'revenue', categoryId: 'cat-1', status: 'paid', date: '2026-03-01T10:00:00Z' },
 { description: 'Vale alimentação', amount: 1800.00, type: 'revenue', categoryId: 'cat-3', status: 'paid', date: '2026-03-01T10:00:00Z' },
 { description: 'Freelance', amount: 499.99, type: 'revenue', categoryId: 'cat-2', status: 'paid', date: '2026-03-15T10:00:00Z' },
 ];

 // Fixed Expenses
 const fixedExpenses = [
 { description: 'Internet', amount: 99.99, type: 'expense_fixed', categoryId: 'cat-4', status: 'paid', date: '2026-03-05T10:00:00Z' },
 { description: 'Energia', amount: 154.30, type: 'expense_fixed', categoryId: 'cat-5', status: 'paid', date: '2026-03-10T10:00:00Z' },
 { description: 'Claro Elias', amount: 63.14, type: 'expense_fixed', categoryId: 'cat-4', status: 'paid', date: '2026-03-12T10:00:00Z' },
 { description: 'Gasolina carro', amount: 500.00, type: 'expense_fixed', categoryId: 'cat-6', status: 'paid', date: '2026-03-15T10:00:00Z' },
 { description: 'Consórcio carro', amount: 682.32, type: 'expense_fixed', categoryId: 'cat-7', status: 'paid', date: '2026-03-20T10:00:00Z', installments: { current: 3, total: 62 } },
 { description: 'Consignado carro', amount: 604.92, type: 'expense_fixed', categoryId: 'cat-7', status: 'paid', date: '2026-03-20T10:00:00Z', installments: { current: 0, total: 48 } },
 { description: 'Consórcio moto', amount: 492.83, type: 'expense_fixed', categoryId: 'cat-7', status: 'paid', date: '2026-03-20T10:00:00Z', installments: { current: 36, total: 38 } },
 { description: 'Consignado placa solar', amount: 568.11, type: 'expense_fixed', categoryId: 'cat-7', status: 'paid', date: '2026-03-20T10:00:00Z', installments: { current: 6, total: 29 } },
 { description: 'Seguro casa', amount: 72.76, type: 'expense_fixed', categoryId: 'cat-7', status: 'paid', date: '2026-03-20T10:00:00Z' },
 { description: 'Seguro vida Simples Elias', amount: 20.00, type: 'expense_fixed', categoryId: 'cat-7', status: 'paid', date: '2026-03-20T10:00:00Z' },
 { description: 'Seguro vida Individual Elias', amount: 56.70, type: 'expense_fixed', categoryId: 'cat-7', status: 'paid', date: '2026-03-20T10:00:00Z' },
 { description: 'Escola Flamengo Buritis', amount: 135.00, type: 'expense_fixed', categoryId: 'cat-8', status: 'paid', date: '2026-03-20T10:00:00Z' },
 ];

 // Credit Card
 const creditCards = [
 { description: 'Sicoob Card', amount: 3631.25, type: 'credit_card', categoryId: 'cat-11', status: 'pending', date: '2026-03-25T10:00:00Z' },
 { description: 'Nubank Elias', amount: 780.18, type: 'credit_card', categoryId: 'cat-11', status: 'pending', date: '2026-03-25T10:00:00Z' },
 { description: 'Nubank Kellen', amount: 750.00, type: 'credit_card', categoryId: 'cat-11', status: 'pending', date: '2026-03-25T10:00:00Z' },
 { description: 'Lojas Renner', amount: 221.11, type: 'credit_card', categoryId: 'cat-11', status: 'pending', date: '2026-03-25T10:00:00Z', installments: { current: 2, total: 5 } },
 ];

 // Variable Expenses
 const variableExpenses = [
 { description: 'Detran moto', amount: 230.35, type: 'expense_variable', categoryId: 'cat-6', status: 'paid', date: '2026-03-05T10:00:00Z' },
 { description: 'Detran Etios', amount: 1345.49, type: 'expense_variable', categoryId: 'cat-6', status: 'paid', date: '2026-03-05T10:00:00Z' },
 { description: 'Pneu carro', amount: 650.00, type: 'expense_variable', categoryId: 'cat-6', status: 'paid', date: '2026-03-08T10:00:00Z' },
 { description: 'Circo', amount: 170.00, type: 'expense_variable', categoryId: 'cat-9', status: 'paid', date: '2026-03-10T10:00:00Z' },
 { description: 'Corte cabelo', amount: 90.00, type: 'expense_variable', categoryId: 'cat-9', status: 'paid', date: '2026-03-12T10:00:00Z' },
 { description: 'Espetinho', amount: 67.00, type: 'expense_variable', categoryId: 'cat-9', status: 'paid', date: '2026-03-15T10:00:00Z' },
 { description: 'Café feira', amount: 50.00, type: 'expense_variable', categoryId: 'cat-9', status: 'paid', date: '2026-03-16T10:00:00Z' },
 { description: 'Frango caipira', amount: 45.00, type: 'expense_variable', categoryId: 'cat-9', status: 'paid', date: '2026-03-18T10:00:00Z' },
 { description: 'Gasolina', amount: 50.00, type: 'expense_variable', categoryId: 'cat-6', status: 'paid', date: '2026-03-20T10:00:00Z' },
 { description: 'Gasolina', amount: 100.00, type: 'expense_variable', categoryId: 'cat-6', status: 'paid', date: '2026-03-21T10:00:00Z' },
 { description: 'Pix Ketler', amount: 322.00, type: 'expense_variable', categoryId: 'cat-9', status: 'paid', date: '2026-03-22T10:00:00Z' },
 { description: 'Pix Kellen', amount: 625.00, type: 'expense_variable', categoryId: 'cat-9', status: 'paid', date: '2026-03-22T10:00:00Z' },
 ];

 const all = [...revenues, ...fixedExpenses, ...creditCards, ...variableExpenses];
 for (const item of all) {
 await financeService.addTransaction(userId, item as any);
 }

 // Seed Goals
 const initialGoals: Goal[] = [
 { id: 'goal-1', userId, name: 'Reserva de Emergência', targetAmount: 20000, currentAmount: 5430, color: '#10b981', icon: 'Shield', status: 'active' },
 { id: 'goal-2', userId, name: 'Viagem Japão', targetAmount: 15000, currentAmount: 1200, color: '#f59e0b', icon: 'Plane', status: 'active' }
 ];

 for (const goal of initialGoals) {
 await financeService.addGoalWithId(userId, goal.id, goal);
 }

 setIsSeeding(false);
 };

 const handleLogin = async () => {
 setIsLoggingIn(true);
 try {
 await loginWithGoogle();
 } catch (error) {
 console.error('Login error:', error);
 } finally {
 setIsLoggingIn(false);
 }
 };

 const handleLogout = async () => {
 try {
 await logout();
 } catch (error) {
 console.error('Logout error:', error);
 }
 };

 const handleAddTransaction = async (data: any) => {
 if (user) {
 if (editingTransaction) {
 await financeService.updateTransaction(user.uid, editingTransaction.id, data);
 setEditingTransaction(null);
 } else {
 await financeService.addTransaction(user.uid, data);
 }
 }
 };

 const handleEditClick = (id: string) => {
 const transaction = transactions.find(t => t.id === id);
 if (transaction) {
 setEditingTransaction(transaction);
 setIsTransactionFormOpen(true);
 }
 };

 const handleDeleteTransaction = async () => {
 if (user && deletingTransactionId) {
 await financeService.deleteTransaction(user.uid, deletingTransactionId);
 setDeletingTransactionId(null);
 }
 };

 if (!isAuthReady || isLoading) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-neutral-50 ">
 <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
 </div>
 );
 }

 if (!user) {
 return <Auth onLogin={handleLogin} isLoading={isLoggingIn} />;
 }

 return (
 <ErrorBoundary>
 <Layout 
 onAddTransaction={(type) => {
 setEditingTransaction(null);
 setInitialType(type);
 setIsTransactionFormOpen(true);
 }}
 onOpenCategories={() => setIsCategoryManagerOpen(true)}
 onOpenGoals={() => setIsGoalManagerOpen(true)}
 onFilterType={(type) => setTypeFilter(type)}
 onLogout={handleLogout}
 user={userProfile}
 >
 {isSeeding && (
 <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between animate-pulse">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
 <p className="text-sm font-medium text-primary">Importando seus dados iniciais...</p>
 </div>
 </div>
 )}
 <div className="space-y-8">

 <Dashboard 
 transactions={filteredTransactions} 
 categories={categories}
 goals={goals}
 user={userProfile}
 currentMonth={currentMonth}
 currentYear={currentYear}
 onMonthChange={setCurrentMonth}
 onYearChange={setCurrentYear}
 onAddTransaction={(type) => {
 setEditingTransaction(null);
 setInitialType(type);
 setIsTransactionFormOpen(true);
 }}
 onOpenCategories={() => setIsCategoryManagerOpen(true)}
 onOpenGoals={() => setIsGoalManagerOpen(true)}
 />
 
 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
 <div className="lg:col-span-3 space-y-6">
 <TransactionList 
 transactions={transactions} 
 categories={categories}
 typeFilter={typeFilter}
 onTypeFilterChange={setTypeFilter}
 onEdit={handleEditClick}
 onDelete={setDeletingTransactionId}
 />

 {/* Upcoming Bills */}
 <div className="card p-6">
 <h3 className="font-display font-bold text-lg mb-4">Próximos Vencimentos</h3>
 <div className="space-y-4">
 {filteredTransactions
 .filter(t => t.status === 'pending' && t.type !== 'revenue')
 .slice(0, 5)
 .map(t => (
 <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100 ">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
 <Clock size={20} />
 </div>
 <div>
 <p className="font-medium text-sm">{t.description}</p>
 <p className="text-xs text-amber-600">Vence em {formatDate(t.date)}</p>
 </div>
 </div>
 <p className="font-bold text-amber-700 ">{formatCurrency(t.amount)}</p>
 </div>
 ))}
 {transactions.filter(t => t.status === 'pending' && t.type !== 'revenue').length === 0 && (
 <p className="text-center text-neutral-500 py-4">Nenhum vencimento pendente.</p>
 )}
 </div>
 </div>
 </div>
 
 <div className="space-y-6">
 <div className="card p-6 bg-primary/5 border-primary/10">
 <h3 className="font-display font-bold text-primary mb-2">Dica Financeira</h3>
 <p className="text-sm text-neutral-600 whitespace-pre-line">
 {advice}
 </p>
 </div>
 </div>
 </div>
 </div>

 <TransactionForm 
 isOpen={isTransactionFormOpen}
 onClose={() => {
 setIsTransactionFormOpen(false);
 setEditingTransaction(null);
 }}
 onSubmit={handleAddTransaction}
 categories={categories}
 initialData={editingTransaction}
 initialType={initialType}
 onOpenCategories={() => setIsCategoryManagerOpen(true)}
 />

 <CategoryManager 
 isOpen={isCategoryManagerOpen}
 onClose={() => setIsCategoryManagerOpen(false)}
 categories={categories}
 transactions={transactions}
 onAdd={(cat) => financeService.addCategory(user.uid, cat)}
 onUpdate={(id, cat) => financeService.updateCategory(user.uid, id, cat)}
 onDelete={(id) => financeService.deleteCategory(user.uid, id)}
 />

 {isGoalManagerOpen && (
 <GoalManager
 userId={user.uid}
 goals={goals}
 onClose={() => setIsGoalManagerOpen(false)}
 />
 )}

 <ConfirmModal 
 isOpen={!!deletingTransactionId}
 onClose={() => setDeletingTransactionId(null)}
 onConfirm={handleDeleteTransaction}
 title="Excluir Transação"
 message="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
 />
 </Layout>
 </ErrorBoundary>
 );
}
