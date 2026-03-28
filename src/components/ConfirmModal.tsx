/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 title: string;
 message: string;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {
 if (!isOpen) return null;

 return (
 <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
 <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
 <div className="p-6 text-center space-y-4">
 <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
 <AlertTriangle size={32} />
 </div>
 <div className="space-y-2">
 <h2 className="text-xl font-display font-bold">{title}</h2>
 <p className="text-sm text-neutral-500">{message}</p>
 </div>
 <div className="flex gap-3 pt-4">
 <button onClick={onClose} className="btn btn-secondary flex-1">Cancelar</button>
 <button 
 onClick={() => {
 onConfirm();
 onClose();
 }} 
 className="btn bg-red-600 text-white hover:bg-red-700 flex-1"
 >
 Excluir
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
