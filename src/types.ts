/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'revenue' | 'expense_fixed' | 'expense_variable' | 'credit_card';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  budget?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  date: string; // ISO 8601
  type: TransactionType;
  categoryId: string;
  status: 'paid' | 'pending';
  installments?: {
    current: number;
    total: number;
  };
  notes?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  color: string;
  icon: string;
  status: 'active' | 'completed' | 'archived';
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  currency: string;
  theme: 'light' | 'dark';
}
