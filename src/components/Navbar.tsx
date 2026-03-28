/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wallet, LogOut, User, Menu, X } from 'lucide-react';
import { cn } from '../utils.ts';

interface NavbarProps {
 onAddTransaction: (type: any) => void;
 onOpenCategories: () => void;
 onOpenGoals: () => void;
 onFilterType: (type: any) => void;
 onLogout: () => void;
 user: any;
}

export function Navbar({ onAddTransaction, onOpenCategories, onOpenGoals, onFilterType, onLogout, user }: NavbarProps) {
 const [isMenuOpen, setIsMenuOpen] = React.useState(false);

 const menuItems = [
 { label: 'Sair', icon: <LogOut size={18} />, onClick: onLogout, color: 'text-neutral-500' },
 ];

 return (
 <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 ">
 <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
 <div className="flex items-center gap-2">
 <div className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
 <Wallet size={20} className="md:hidden" />
 <Wallet size={24} className="hidden md:block" />
 </div>
 <span className="font-display font-bold text-lg md:text-xl tracking-tight truncate">Minhas Finanças</span>
 </div>

 {/* Desktop Menu */}
 <div className="hidden md:flex items-center gap-6">
 <div className="flex items-center gap-1 border-r border-neutral-200 pr-6">
 {menuItems.map((item) => (
 <button
 key={item.label}
 onClick={item.onClick}
 className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-100 :bg-neutral-800 transition-colors text-sm font-medium text-neutral-600 "
 >
 <span className={item.color}>{item.icon}</span>
 <span className="hidden lg:block">{item.label}</span>
 </button>
 ))}
 </div>
 
 <div className="flex items-center gap-3 pl-6 border-l border-neutral-200 ">
 <div className="text-right hidden lg:block">
 <p className="text-sm font-medium ">{user?.displayName || 'Usuário'}</p>
 <p className="text-xs text-neutral-500">{user?.email || ''}</p>
 </div>
 <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden ring-2 ring-white ">
 <img 
 src={user?.photoURL || "https://picsum.photos/seed/user/100/100"} 
 alt="User Profile" 
 className="w-full h-full object-cover"
 referrerPolicy="no-referrer"
 />
 </div>
 </div>
 </div>

 {/* Mobile Menu Toggle */}
 <button 
 className="md:hidden p-2 rounded-xl hover:bg-neutral-100 :bg-neutral-800 transition-colors "
 onClick={() => setIsMenuOpen(!isMenuOpen)}
 >
 {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
 </button>
 </div>

 {/* Mobile Menu */}
 {isMenuOpen && (
 <div className="md:hidden bg-white border-b border-neutral-200 p-4 animate-in slide-in-from-top duration-200 shadow-xl">
 <div className="flex flex-col gap-2">
 <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl mb-2">
 <div className="w-12 h-12 rounded-full bg-neutral-200 overflow-hidden ring-2 ring-primary/20">
 <img 
 src={user?.photoURL || "https://picsum.photos/seed/user/100/100"} 
 alt="User Profile" 
 className="w-full h-full object-cover"
 referrerPolicy="no-referrer"
 />
 </div>
 <div className="min-w-0">
 <p className="font-bold truncate">{user?.displayName || 'Usuário'}</p>
 <p className="text-xs text-neutral-500 truncate">{user?.email || ''}</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-2 mb-2">
 {menuItems.map((item) => (
 <button
 key={item.label}
 onClick={() => {
 item.onClick();
 setIsMenuOpen(false);
 }}
 className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 :bg-neutral-800 transition-all border border-transparent hover:border-neutral-200 :border-neutral-700"
 >
 <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm", item.color)}>
 {item.icon}
 </div>
 <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{item.label}</span>
 </button>
 ))}
 </div>
 </div>
 </div>
 )}
 </nav>
 );
}
