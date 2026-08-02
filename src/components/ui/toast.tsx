import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  const types = {
    info: 'bg-slate-900 text-white',
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
  };

  return (
    <div
      className={cn(
        'fixed bottom-5 right-5 z-50 flex items-center justify-between gap-4 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all animate-in slide-in-from-bottom-5',
        types[type]
      )}
    >
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-70 hover:opacity-100 text-base">
          ✕
        </button>
      )}
    </div>
  );
}