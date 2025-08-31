'use client';
import React from 'react';
import { auth, provider, FIREBASE_READY } from '@/lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export default function AuthButton() {
  const signIn = async () => {
    if (!auth || !provider) return alert('Firebase not configured.');
    await signInWithPopup(auth, provider);
  };
  const signOutFn = async () => {
    if (!auth) return;
    await signOut(auth);
  };
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button className="btn" onClick={signIn} disabled={!FIREBASE_READY}>Sign in</button>
      <button className="btn" onClick={signOutFn} disabled={!FIREBASE_READY}>Sign out</button>
    </div>
  );
}
