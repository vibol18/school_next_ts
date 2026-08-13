import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  accentColor?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, accentColor = '#5b51ef', icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-[10px] border border-[#e5e7eb] shadow-sm p-5 flex flex-col gap-3 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 rounded-t-[10px]" style={{ backgroundColor: accentColor }} />
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: accentColor + '14' }}
          >
            {icon}
          </div>
        )}
      </div>
      <span className="text-2xl font-bold text-[#111827]">{value}</span>
    </div>
  );
}
