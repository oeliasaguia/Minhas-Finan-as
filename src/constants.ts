/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category } from './types.ts';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Salário', icon: 'DollarSign', color: '#10B981', type: 'revenue' },
  { id: 'cat-2', name: 'Freelance', icon: 'Briefcase', color: '#3B82F6', type: 'revenue' },
  { id: 'cat-3', name: 'Vale Alimentação', icon: 'Utensils', color: '#F59E0B', type: 'revenue' },
  { id: 'cat-4', name: 'Internet', icon: 'Wifi', color: '#6366F1', type: 'expense_fixed' },
  { id: 'cat-5', name: 'Energia', icon: 'Zap', color: '#FBBF24', type: 'expense_fixed' },
  { id: 'cat-6', name: 'Gasolina', icon: 'Fuel', color: '#EF4444', type: 'expense_variable' },
  { id: 'cat-7', name: 'Seguro', icon: 'ShieldCheck', color: '#10B981', type: 'expense_fixed' },
  { id: 'cat-8', name: 'Escola', icon: 'GraduationCap', color: '#8B5CF6', type: 'expense_fixed' },
  { id: 'cat-9', name: 'Lazer', icon: 'Ticket', color: '#EC4899', type: 'expense_variable' },
  { id: 'cat-10', name: 'Saúde', icon: 'HeartPulse', color: '#EF4444', type: 'expense_variable' },
  { id: 'cat-11', name: 'Cartão de Crédito', icon: 'CreditCard', color: '#374151', type: 'credit_card' },
];

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
