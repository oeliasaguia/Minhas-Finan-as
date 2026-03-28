/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Navbar } from './Navbar.tsx';

interface LayoutProps {
 children: React.ReactNode;
 onAddTransaction: (type: any) => void;
 onOpenCategories: () => void;
 onOpenGoals: () => void;
 onFilterType: (type: any) => void;
 onLogout: () => void;
 user: any;
}

export function Layout({ 
 children, 
 onAddTransaction, 
 onOpenCategories, 
 onOpenGoals,
 onFilterType,
 onLogout,
 user 
}: LayoutProps) {
 return (
 <div className="min-h-screen flex flex-col bg-neutral-50 transition-colors duration-300">
 <Navbar 
 onAddTransaction={onAddTransaction}
 onOpenCategories={onOpenCategories}
 onOpenGoals={onOpenGoals}
 onFilterType={onFilterType}
 onLogout={onLogout}
 user={user}
 />
 <motion.main 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4 }}
 className="flex-1 container mx-auto px-4 sm:px-6 py-6 md:py-8 max-w-7xl"
 >
 {children}
 </motion.main>
 <footer className="py-6 text-center text-neutral-500 text-sm">
 &copy; {new Date().getFullYear()} Minhas Finanças. Todos os direitos reservados.
 </footer>
 </div>
 );
}
