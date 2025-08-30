'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import ThemeProvider from '@/components/ThemeProvider';
import TopNav from '@/components/TopNav';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased">
        <AuthProvider>
          <ThemeProvider>
            <TopNav />
            <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}