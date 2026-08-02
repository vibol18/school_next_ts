import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn'; 

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full px-3.5 py-2 text-sm rounded-lg border bg-white text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-50 disabled:text-slate-500',
          error
            ? 'border-rose-500 focus:ring-rose-500'
            : 'border-slate-300 focus:border-[#5b51ef] focus:ring-[#5b51ef]',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';