'use client';

import React, { useEffect, useState } from 'react';
import { User, Mail, Shield, Key } from 'lucide-react';

interface UserProfile {
  username: string;
  email: string;
  role: string;
}

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Read from localStorage that was set during login
    const storedRole = localStorage.getItem("userRole") || "Unknown";
    const storedName = localStorage.getItem("username") || "Admin User";
    const storedEmail = localStorage.getItem("userEmail") || "admin@educore.com";

    setProfile({
      username: storedName,
      email: storedEmail,
      role: storedRole.charAt(0).toUpperCase() + storedRole.slice(1).toLowerCase(),
    });
  }, []);

  if (!profile) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Profile Settings</h1>
        <p className="text-sm text-[#6b7280]">Manage your account details and preferences</p>
      </div>

      <div className="bg-white rounded-[10px] border border-[#e5e7eb] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e5e7eb] flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#4338ca] text-white flex items-center justify-center text-3xl font-bold">
            {profile.username.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#111827]">{profile.username}</h2>
            <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#e5e5fa] text-[#4f46e5] text-xs font-semibold uppercase tracking-wide">
              {profile.role}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                <User className="w-4 h-4 text-[#6b7280]" />
                Username
              </label>
              <input
                type="text"
                disabled
                value={profile.username}
                className="w-full px-3 py-2 bg-[#f8fafc] border border-[#e5e7eb] rounded-md text-[#6b7280] text-sm cursor-not-allowed"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#6b7280]" />
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3 py-2 bg-[#f8fafc] border border-[#e5e7eb] rounded-md text-[#6b7280] text-sm cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#6b7280]" />
                Access Role
              </label>
              <input
                type="text"
                disabled
                value={profile.role}
                className="w-full px-3 py-2 bg-[#f8fafc] border border-[#e5e7eb] rounded-md text-[#6b7280] text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-[#e5e7eb]">
            <h3 className="text-base font-semibold text-[#111827] mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#6b7280]" />
              Security
            </h3>
            <button className="bg-white border border-[#e5e7eb] text-[#111827] hover:bg-slate-50 px-4 py-2 rounded-[8px] text-sm font-medium transition-colors shadow-sm">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
