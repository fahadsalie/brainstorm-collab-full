'use client';
import { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { auth, provider, db } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

type Ctx = { user: User | null; signIn: () => Promise<void>; signOutUser: () => Promise<void>; };
const AuthCtx = createContext<Ctx>({ user: null, signIn: async () => {}, signOutUser: async () => {} });
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() =>
    onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await setDoc(doc(db, 'users', u.uid), {
          uid: u.uid, email: u.email, name: u.displayName, photoURL: u.photoURL, updatedAt: serverTimestamp()
        }, { merge: true });
      }
      setLoading(false);
    })
  , []);

  const signIn = async () => { await signInWithPopup(auth, provider); };
  const signOutUser = async () => { await signOut(auth); };

  if (loading) return <div className="p-8">Loading...</div>;
  return <AuthCtx.Provider value={{ user, signIn, signOutUser }}>{children}</AuthCtx.Provider>;
}
