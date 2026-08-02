import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn'; 

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, title, children, className }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className={cn(
          'w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 p-6 space-y-4 relative',
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          {title && <h3 className="text-lg font-bold text-slate-900">{title}</h3>}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg rounded-lg p-1 transition"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}