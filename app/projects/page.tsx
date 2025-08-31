'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth, provider, db, FIREBASE_READY, MISSING_KEYS } from '@/lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';

type Project = { id: string; name: string; createdAt?: any; by?: string };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!db) return; // Safe if Firebase isn't configured
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setProjects(rows as Project[]);
    });
    return () => unsub();
  }, []);

  const handleAdd = async () => {
    if (!db) return alert('Configure Firebase env vars in Vercel first.');
    if (!name.trim()) return;
    await addDoc(collection(db, 'projects'), {
      name: name.trim(),
      createdAt: serverTimestamp(),
      by: auth?.currentUser?.uid || 'anon',
    });
    setName('');
  };

  const handleSignIn = async () => {
    if (!auth || !provider) return alert('Firebase not configured (env vars missing).');
    await signInWithPopup(auth, provider);
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  return (
    <main style={{ padding: '2rem', maxWidth: 820, margin: '0 auto' }}>
      <h1>Projects</h1>
      <p style={{ opacity: 0.8 }}>
        This page uses Firestore <em>if</em> Firebase is configured. Otherwise it stays read-only and
        shows setup help.
      </p>

      {!FIREBASE_READY && (
        <div style={{ marginTop: 12, padding: 12, border: '1px solid #334', borderRadius: 10 }}>
          <strong>Firebase not configured.</strong>
          <div style={{ marginTop: 6 }}>
            Add these keys in Vercel → Project → Settings → Environment Variables:
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {MISSING_KEYS.map((k) => (
                <li key={k}><code>{k}</code></li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <button onClick={handleSignIn} disabled={!FIREBASE_READY} className="btn">Sign in with Google</button>
        <button onClick={handleSignOut} disabled={!FIREBASE_READY} className="btn">Sign out</button>
        <Link href="/" style={{ marginLeft: 8 }}>Back home</Link>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project name"
          style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #334', flex: 1, minWidth: 220 }}
          disabled={!FIREBASE_READY}
        />
        <button onClick={handleAdd} className="btn" disabled={!FIREBASE_READY || !name.trim()}>
          Add Project
        </button>
      </div>

      <ul style={{ marginTop: 16, paddingLeft: 18 }}>
        {projects.map((p) => (
          <li key={p.id}>
            <code>{p.name}</code> <span style={{ opacity: 0.6 }}>({p.id})</span>
          </li>
        ))}
        {projects.length === 0 && <li style={{ opacity: 0.7 }}>No projects yet.</li>}
      </ul>
    </main>
  );
}
