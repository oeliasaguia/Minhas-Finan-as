/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wallet, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onLogin: () => void;
  isLoading?: boolean;
}

export function Auth({ onLogin, isLoading }: AuthProps) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md card p-8 space-y-8 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary/30">
            <Wallet size={48} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Minhas Finanças</h1>
            <p className="text-neutral-500 mt-2">Controle suas finanças de forma simples e elegante.</p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onLogin}
            disabled={isLoading}
            className="w-full btn btn-primary py-4 text-lg gap-3 shadow-xl shadow-primary/20"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={24} />
                <span>Entrar com Google</span>
              </>
            )}
          </button>
          
          <p className="text-xs text-neutral-400">
            Ao entrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </p>
        </div>

        <div className="pt-8 grid grid-cols-3 gap-4">
          <Feature icon="📊" label="Gráficos" />
          <Feature icon="🔒" label="Seguro" />
          <Feature icon="📱" label="Mobile" />
        </div>
      </motion.div>
    </div>
  );
}

function Feature({ icon, label }: { icon: string, label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</span>
    </div>
  );
}
