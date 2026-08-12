import React from 'react';

type BadgeVariant = 'green' | 'amber' | 'red' | 'indigo' | 'slate';

const variantMap: Record<string, BadgeVariant> = {
  // Green — positive states
  active: 'green',
  paid: 'green',
  present: 'green',
  enrolled: 'green',
  approved: 'green',
  available: 'green',
  returned: 'green',
  allocated: 'green',
  current: 'green',

  // Amber — neutral / in-progress
  pending: 'amber',
  late: 'amber',
  'in-progress': 'amber',
  issued: 'amber',
  partial: 'amber',
  leave: 'amber',
  processing: 'amber',

  // Red — negative states
  inactive: 'red',
  absent: 'red',
  overdue: 'red',
  failed: 'red',
  rejected: 'red',
  suspended: 'red',
  lost: 'red',
  vacated: 'red',

  // Indigo — informational
  new: 'indigo',
  info: 'indigo',
  submitted: 'indigo',
  graded: 'indigo',
};

const variantStyles: Record<BadgeVariant, string> = {
  green:  'bg-[#dbf5e3] text-[#16a34a]',
  amber:  'bg-[#fcedd4] text-[#d97706]',
  red:    'bg-[#fde2e2] text-[#dc2626]',
  indigo: 'bg-[#e5e5fa] text-[#4f46e5]',
  slate:  'bg-slate-100 text-slate-600',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant, className = '' }: BadgeProps) {
  const text = String(children).toLowerCase().trim();
  const resolvedVariant = variant ?? variantMap[text] ?? 'slate';
  const styles = variantStyles[resolvedVariant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${styles} ${className}`}
    >
      {children}
    </span>
  );
}
