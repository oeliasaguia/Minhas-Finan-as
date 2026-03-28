/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  db, 
  auth, 
  handleFirestoreError, 
  OperationType 
} from '../firebase.ts';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  orderBy,
  serverTimestamp,
  deleteField
} from 'firebase/firestore';
import { Transaction, Category, UserProfile, Goal } from '../types.ts';

const USERS_COLLECTION = 'users';
const TRANSACTIONS_SUBCOLLECTION = 'transactions';
const CATEGORIES_SUBCOLLECTION = 'categories';
const GOALS_SUBCOLLECTION = 'goals';

const removeUndefined = (obj: any, isUpdate = false) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    } else if (newObj[key] === null) {
      if (isUpdate) {
        newObj[key] = deleteField();
      } else {
        delete newObj[key];
      }
    }
  });
  return newObj;
};

export const financeService = {
  // User Profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
      return userDoc.exists() ? userDoc.data() as UserProfile : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${USERS_COLLECTION}/${uid}`);
      return null;
    }
  },

  async createUserProfile(profile: UserProfile): Promise<void> {
    try {
      await setDoc(doc(db, USERS_COLLECTION, profile.uid), removeUndefined(profile));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${USERS_COLLECTION}/${profile.uid}`);
    }
  },

  async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    try {
      await updateDoc(doc(db, USERS_COLLECTION, uid), removeUndefined(data, true));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${USERS_COLLECTION}/${uid}`);
    }
  },

  // Transactions
  subscribeToTransactions(userId: string, callback: (transactions: Transaction[]) => void) {
    const path = `${USERS_COLLECTION}/${userId}/${TRANSACTIONS_SUBCOLLECTION}`;
    const q = query(
      collection(db, path),
      orderBy('date', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      callback(transactions);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async addTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'userId'>): Promise<string> {
    const path = `${USERS_COLLECTION}/${userId}/${TRANSACTIONS_SUBCOLLECTION}`;
    try {
      const docRef = doc(collection(db, path));
      const data = {
        ...transaction,
        id: docRef.id,
        userId,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(docRef, removeUndefined(data));
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  },

  async updateTransaction(userId: string, transactionId: string, data: Partial<Transaction>): Promise<void> {
    const path = `${USERS_COLLECTION}/${userId}/${TRANSACTIONS_SUBCOLLECTION}/${transactionId}`;
    try {
      await updateDoc(doc(db, path), removeUndefined(data, true));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    const path = `${USERS_COLLECTION}/${userId}/${TRANSACTIONS_SUBCOLLECTION}/${transactionId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Categories
  subscribeToCategories(userId: string, callback: (categories: Category[]) => void) {
    const path = `${USERS_COLLECTION}/${userId}/${CATEGORIES_SUBCOLLECTION}`;
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      callback(categories);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async addCategory(userId: string, category: Omit<Category, 'id'>): Promise<string> {
    const path = `${USERS_COLLECTION}/${userId}/${CATEGORIES_SUBCOLLECTION}`;
    try {
      const docRef = doc(collection(db, path));
      const data = {
        ...category,
        id: docRef.id
      };
      await setDoc(docRef, removeUndefined(data));
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  },

  async addCategoryWithId(userId: string, categoryId: string, category: Category): Promise<void> {
    const path = `${USERS_COLLECTION}/${userId}/${CATEGORIES_SUBCOLLECTION}/${categoryId}`;
    try {
      await setDoc(doc(db, path), removeUndefined(category));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateCategory(userId: string, categoryId: string, data: Partial<Category>): Promise<void> {
    const path = `${USERS_COLLECTION}/${userId}/${CATEGORIES_SUBCOLLECTION}/${categoryId}`;
    try {
      await updateDoc(doc(db, path), removeUndefined(data, true));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteCategory(userId: string, categoryId: string): Promise<void> {
    const path = `${USERS_COLLECTION}/${userId}/${CATEGORIES_SUBCOLLECTION}/${categoryId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Goals
  subscribeToGoals(userId: string, callback: (goals: Goal[]) => void) {
    const path = `${USERS_COLLECTION}/${userId}/${GOALS_SUBCOLLECTION}`;
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
      const goals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Goal[];
      callback(goals);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async addGoal(userId: string, goal: Omit<Goal, 'id' | 'userId'>): Promise<string> {
    const path = `${USERS_COLLECTION}/${userId}/${GOALS_SUBCOLLECTION}`;
    try {
      const docRef = doc(collection(db, path));
      const data = {
        ...goal,
        id: docRef.id,
        userId
      };
      await setDoc(docRef, removeUndefined(data));
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  },

  async addGoalWithId(userId: string, goalId: string, goal: Goal): Promise<void> {
    const path = `${USERS_COLLECTION}/${userId}/${GOALS_SUBCOLLECTION}/${goalId}`;
    try {
      await setDoc(doc(db, path), removeUndefined(goal));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateGoal(userId: string, goalId: string, data: Partial<Goal>): Promise<void> {
    const path = `${USERS_COLLECTION}/${userId}/${GOALS_SUBCOLLECTION}/${goalId}`;
    try {
      await updateDoc(doc(db, path), removeUndefined(data, true));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteGoal(userId: string, goalId: string): Promise<void> {
    const path = `${USERS_COLLECTION}/${userId}/${GOALS_SUBCOLLECTION}/${goalId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};
