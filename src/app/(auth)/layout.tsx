import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8 overflow-hidden bg-slate-50">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[#5b51ef]/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(100_116_139/0.08)_1px,transparent_0)] [background-size:24px_24px]" />
      </div>
      {children}
    </div>
  );
}
