'use client';

import React, { createContext, useContext, useState } from 'react';

/**
 * Minimal AuthProvider with a named export `useAuth`.
 * - Satisfies `import { useAuth } from './AuthProvider'`
 * - Also provides a default export component for wrapping your app if needed.
 * - Non-blocking: works even without Firebase env vars.
 */

type User = { uid: string; displayName?: string | null; email?: string | null } | null;

type AuthContextValue = {
  user: User;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  // Placeholder sign-in/out methods; replace with Firebase Auth if you wish.
  const signIn = async () => {
    // no-op
    setUser({ uid: 'demo', displayName: 'Demo User', email: 'demo@example.com' });
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
