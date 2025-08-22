'use client';
import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function TopNav() {
  const { user, signIn, signOutUser } = useAuth();
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800">
      <Link href="/dashboard" className="flex items-center gap-3">
        <span className="font-semibold">Brainstorm</span>
      </Link>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-slate-400 hidden sm:block">{user.displayName}</span>
            <button onClick={signOutUser} className="btn">Sign Out</button>
          </>
        ) : (
          <button onClick={signIn} className="btn">Sign in with Google</button>
        )}
      </div>
    </div>
  );
}
