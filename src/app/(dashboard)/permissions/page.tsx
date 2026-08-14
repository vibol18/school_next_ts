'use client';

import React from 'react';
import {
  ShieldCheck,
  Check,
  X,
  Users,
} from 'lucide-react';
import {
  ROLE_KEYS,
  roleLabels,
  roleStyles,
  permissionFeatures,
  type RoleKey,
} from '@/lib/auth/rolePermissions';

const getRole = () => {
  if (typeof window === 'undefined') return null;
  return (localStorage.getItem('userRole') || 'STUDENT').toUpperCase();
};

export default function PermissionsPage() {
  const currentRole = getRole();

  const roleCounts = ROLE_KEYS.map((role) => ({
    role,
    count: permissionFeatures.filter((f) => f.roles.includes(role)).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#5b51ef] text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Access Control
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Role Permissions</h1>
          <p className="text-sm text-[#6b7280] mt-1">
            What each role can access across the school management system.
          </p>
        </div>
        {currentRole && (
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-[12px] font-semibold text-slate-600">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Your role:
            <span className={`px-2 py-0.5 rounded-full uppercase tracking-wide ${roleStyles[currentRole as RoleKey] ?? 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200'}`}>
              {currentRole}
            </span>
          </div>
        )}
      </div>

      {/* Role summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {roleCounts.map(({ role, count }) => (
          <div key={role} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${roleStyles[role]}`}>
              {role}
            </span>
            <p className="mt-3 text-2xl font-bold text-slate-900">{count}</p>
            <p className="text-[11px] font-medium text-slate-500">
              {roleLabels[role]} · {count} features
            </p>
          </div>
        ))}
      </div>

      {/* Permissions matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Feature
                </th>
                {ROLE_KEYS.map((role) => (
                  <th key={role} className="px-4 py-4 text-center">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${roleStyles[role]}`}>
                      {role}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionFeatures.map((feature) => (
                <tr key={feature.key} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-3">
                    <p className="text-[13px] font-semibold text-slate-800">{feature.label}</p>
                    {feature.description && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{feature.description}</p>
                    )}
                  </td>
                  {ROLE_KEYS.map((role) => {
                    const allowed = feature.roles.includes(role);
                    return (
                      <td key={role} className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${allowed ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                          {allowed ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
