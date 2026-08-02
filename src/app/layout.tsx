// src/app/layout.tsx
import React from "react";
import "./globals.css"; // Ensure your CSS/Tailwind imports here
import Providers from "./providers";

export const metadata = {
  title: "EduCore School Management",
  description: "School Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 font-sans text-slate-800 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}