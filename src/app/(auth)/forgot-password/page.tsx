'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const response = await authApi.forgotPassword({ email });
      setStatusMsg({ type: 'success', text: response.message });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900">Forgot Password</h2>
      <p className="mt-2 text-xs text-slate-500">
        Enter your registered email address to receive a password reset link.
      </p>

      {statusMsg.text && (
        <div
          className={`mt-4 p-3 rounded-2xl text-xs ${
            statusMsg.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            required
            placeholder="you@school.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-[#534BEB] focus:bg-white focus:ring-2 focus:ring-[#534BEB]/20"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-[#534BEB] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#4338CA] disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 text-center text-xs">
        <Link href="/login" className="font-medium text-[#534BEB] hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

