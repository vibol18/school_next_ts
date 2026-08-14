'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Call login API (client.ts unwraps the HTTP body -> raw LoginResponse)
      const data = await authApi.login({
        usernameOrEmail: usernameOrEmail.trim(),
        password,
      });

      // 2. Save auth details to localStorage
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('userRole', data.user?.role ?? data.role ?? '');
        localStorage.setItem('username', data.user?.username ?? data.username ?? '');
        localStorage.setItem('userEmail', data.user?.email ?? data.email ?? '');
        localStorage.setItem('userFirstName', data.user?.firstName ?? '');
        localStorage.setItem('userLastName', data.user?.lastName ?? '');
        localStorage.setItem('userPhoto', data.user?.profilePhoto ?? '');
        localStorage.setItem('userId', String(data.user?.id ?? data.userId ?? ''));

        // Success - redirect to dashboard
        router.push('/dashboard');
      } else {
        throw new Error('Invalid response structure from server.');
      }
    } catch (err: any) {
      console.error('Login Error Details:', err?.data || err);
      setErrorMsg(
        err?.data?.message || err?.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-900/5 md:grid md:grid-cols-[1.2fr_1fr]">
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#5b51ef] to-[#4338ca] p-10 text-white relative overflow-hidden">
        <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-20 -bottom-24 w-56 h-56 rounded-full bg-white/10 blur-xl" />
        <div className="relative">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-white font-bold text-lg mb-4">
            E
          </div>
          <div className="text-2xl font-bold tracking-tight">EduCore</div>
          <p className="mt-3 text-xs leading-relaxed text-indigo-100/90 max-w-xs">
            Manage your entire school in one place — students, teachers, classes, exams and more.
          </p>
        </div>
        <div className="relative space-y-3 text-indigo-100/80 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
            Attendance & academic records
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
            Examinations & report cards
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
            Fees, library & communication
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-10 flex flex-col justify-center">
        <div className="mb-6">
          <div className="text-[#5b51ef] font-bold text-2xl tracking-tight mb-1">
            Welcome back
          </div>
          <p className="text-xs text-slate-500">
            Sign in to your school management account.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email or Username
            </label>
            <input
              type="text"
              required
              placeholder="you@school.edu or username"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-[#5b51ef] focus:bg-white focus:ring-2 focus:ring-[#5b51ef]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-[#5b51ef] focus:bg-white focus:ring-2 focus:ring-[#5b51ef]/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-[#5b51ef] px-4 py-3 text-xs font-semibold text-white shadow-md shadow-[#5b51ef]/25 transition hover:bg-[#4338ca] disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500 space-x-2">
          <Link href="/forgot-password" className="font-medium text-[#5b51ef] hover:underline">
            Forgot password?
          </Link>
          <span>•</span>
          <Link href="/register" className="font-medium text-[#5b51ef] hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}