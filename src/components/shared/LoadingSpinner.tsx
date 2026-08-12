import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export function LoadingSpinner({ text = 'Loading...', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 gap-3 ${className}`}>
      <div className="w-8 h-8 border-[3px] border-slate-200 border-t-[#4f46e5] rounded-full animate-spin" />
      <span className="text-sm text-[#6b7280] font-medium">{text}</span>
    </div>
  );
}
