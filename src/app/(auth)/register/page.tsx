'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { Role, roleOptions } from '@/lib/utils/roles';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const trimmedName = username.trim();
      const [firstName, ...rest] = trimmedName.split(' ');
      const lastName = rest.length > 0 ? rest.join(' ') : firstName;

      // Sending username, firstName, lastName, email, password, and role to match Spring Boot DTO
      await authApi.register({
        username: trimmedName,
        firstName,
        lastName,
        email: email.trim(),
        password,
        role,
      });

      setSuccessMsg('Registration successful. Redirecting to login…');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      console.error('Registration Error Details:', err.message, err.data);
      setErrorMsg(
        err.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-900/5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-2 text-xs text-slate-500">
          Sign up to access the school management dashboard.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-700">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Username / Full Name
          </label>
          <input
            id="username"
            type="text"
            required
            placeholder="e.g. Vibol"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-[#5b51ef] focus:bg-white focus:ring-2 focus:ring-[#5b51ef]/20"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@school.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-[#5b51ef] focus:bg-white focus:ring-2 focus:ring-[#5b51ef]/20"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-[#5b51ef] focus:bg-white focus:ring-2 focus:ring-[#5b51ef]/20"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-[#5b51ef] focus:bg-white focus:ring-2 focus:ring-[#5b51ef]/20"
          >
            {roleOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0) + option.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-[#5b51ef] px-4 py-3 text-xs font-semibold text-white shadow-md shadow-[#5b51ef]/20 transition hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-[#5b51ef] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}