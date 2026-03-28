/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
 children: ReactNode;
}

interface State {
 hasError: boolean;
 error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
 public props: Props;
 public state: State = {
 hasError: false,
 error: null,
 };

 public static getDerivedStateFromError(error: Error): State {
 return { hasError: true, error };
 }

 public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
 console.error('Uncaught error:', error, errorInfo);
 }

 public render() {
 if (this.state.hasError) {
 let errorMessage = "Ocorreu um erro inesperado.";
 let isPermissionError = false;

 try {
 const errorData = JSON.parse(this.state.error?.message || '{}');
 if (errorData.error && errorData.error.includes('Missing or insufficient permissions')) {
 errorMessage = "Você não tem permissão para realizar esta ação ou acessar estes dados.";
 isPermissionError = true;
 }
 } catch (e) {
 // Not a JSON error message
 }

 return (
 <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 ">
 <div className="max-w-md w-full card p-8 text-center space-y-6">
 <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
 <AlertCircle size={32} />
 </div>
 <div className="space-y-2">
 <h2 className="text-2xl font-display font-bold">Ops! Algo deu errado</h2>
 <p className="text-neutral-500">{errorMessage}</p>
 </div>
 <button 
 onClick={() => window.location.reload()}
 className="btn btn-primary w-full gap-2"
 >
 <RefreshCw size={18} />
 <span>Recarregar Aplicativo</span>
 </button>
 {isPermissionError && (
 <p className="text-xs text-neutral-400">
 Se o problema persistir, verifique se você está logado com a conta correta.
 </p>
 )}
 </div>
 </div>
 );
 }

 return this.props.children;
 }
}
