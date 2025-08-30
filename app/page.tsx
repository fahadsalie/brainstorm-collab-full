'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function Home() {
  const { user, loading, signIn, signOut } = useAuth();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Brainstorm</h1>
        {!loading && (
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-600">Hi, {user.displayName || user.email}</span>
                <button onClick={signOut} className="rounded-full border px-3 py-1 text-sm">
                  Sign out
                </button>
              </>
            ) : (
              <button onClick={signIn} className="rounded-full border px-3 py-1 text-sm">
                Sign in with Google
              </button>
            )}
          </div>
        )}
      </header>

      <section className="mt-10">
        <p className="text-gray-700">
          Welcome to your collaborative brainstorming space. Head to your dashboard to create and manage projects.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-xl bg-black px-4 py-2 text-white"
        >
          Go to Dashboard
        </Link>
      </section>
    </main>
  );
}
