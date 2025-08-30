'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function TopNav() {
  const { user, signIn, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          Brainstorm
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm hover:underline">Dashboard</Link>
          {user ? (
            <>
              <span className="text-sm text-neutral-600">{user.displayName || user.email}</span>
              <button
                onClick={signOut}
                className="rounded-full border px-3 py-1 text-sm"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={signIn}
              className="rounded-full border px-3 py-1 text-sm"
            >
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}