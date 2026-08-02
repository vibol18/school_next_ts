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
      // 1. Call login API
      const response: any = await authApi.login({
        usernameOrEmail: usernameOrEmail.trim(),
        password,
      });

      // 2. Extract payload safely (accounts for client.ts interceptor unwrapping)
      const data = response?.data || response;

      const accessToken = data?.accessToken || data?.token;
      const refreshToken = data?.refreshToken;
      const role = data?.role || data?.roles?.[0];
      const username = data?.username;

      // 3. Save auth details to localStorage
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (role) localStorage.setItem('userRole', role);
        if (username) localStorage.setItem('username', username);

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
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#534BEB] to-indigo-600 p-10 text-white">
        <div>
          <div className="text-2xl font-bold tracking-tight">EduCore</div>
          <p className="mt-3 text-xs leading-relaxed text-indigo-100/90 max-w-xs">
            Manage your entire school in one place.
          </p>
        </div>
      </div>

      <div className="p-8 sm:p-10 flex flex-col justify-center">
        <div className="mb-6">
          <div className="text-[#534BEB] font-bold text-2xl tracking-tight mb-1">
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
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-[#534BEB] focus:bg-white focus:ring-2 focus:ring-[#534BEB]/20"
            />laceholder page for profile settings.
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
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-[#534BEB] focus:bg-white focus:ring-2 focus:ring-[#534BEB]/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-[#534BEB] px-4 py-3 text-xs font-semibold text-white shadow-md transition hover:bg-[#4338CA] disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500 space-x-2">
          <Link href="/forgot-password" className="font-medium text-[#534BEB] hover:underline">
            Forgot password?
          </Link>
          <span>•</span>
          <Link href="/register" className="font-medium text-[#534BEB] hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}