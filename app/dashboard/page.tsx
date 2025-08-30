'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { db, FIREBASE_READY, MISSING_KEYS } from '@/lib/firebase';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import Link from 'next/link';

type Project = {
  id: string;
  name: string;
  owner: string;
  members: string[];
  createdAt?: { seconds: number; nanoseconds: number } | null;
};

export default function Dashboard() {
  const { user, loading, signIn } = useAuth();
  const [name, setName] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);

  // Firebase env guard
  if (!FIREBASE_READY) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold mb-2">Firebase not configured</h1>
        <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(MISSING_KEYS, null, 2)}</pre>
      </main>
    );
  }

  useEffect(() => {
    if (!db || !user?.uid) return;
    // Show projects where the user is a member (we add the owner into members too)
    const q = query(
      collection(db, 'projects'),
      where('members', 'array-contains', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const rows: Project[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        rows.push({
          id: d.id,
          name: data.name || 'Untitled',
          owner: data.owner,
          members: Array.isArray(data.members) ? data.members : [],
          createdAt: data.createdAt || null,
        });
      });
      setProjects(rows);
    });
    return () => unsub();
  }, [db, user?.uid]);

  const canCreate = useMemo(() => !!user && !!db && name.trim().length > 0, [user, db, name]);

  const createProject = async () => {
    if (!canCreate || !db || !user) return;
    const ref = await addDoc(collection(db, 'projects'), {
      name: name.trim(),
      owner: user.uid,
      members: [user.uid], // include owner as a member so it shows up in the query above
      createdAt: serverTimestamp(),
    });
    // add user again via arrayUnion in case you later add emails → uids logic
    await updateDoc(doc(db, 'projects', ref.id), { members: arrayUnion(user.uid) });
    setName('');
  };

  if (loading) return <main className="p-6">Loading…</main>;

  if (!user) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold mb-3">You’re signed out</h1>
        <button onClick={signIn} className="rounded-full border px-4 py-2">
          Sign in with Google
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Your Projects</h1>
        <Link href="/" className="text-sm underline">
          Home
        </Link>
      </header>

      <section className="mt-6">
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="flex-1 rounded-lg border px-3 py-2"
          />
          <button
            onClick={createProject}
            disabled={!canCreate}
            className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            Create
          </button>
        </div>

        <ul className="mt-8 space-y-3">
          {projects.map((p) => (
            <li key={p.id} className="rounded-lg border p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">Members: {p.members.length}</div>
                </div>
                <Link
                  className="text-sm rounded-full border px-3 py-1"
                  href={`/project/${p.id}`}
                >
                  Open
                </Link>
              </div>
            </li>
          ))}
          {projects.length === 0 && (
            <li className="text-gray-500 text-sm">No projects yet. Create your first project above.</li>
          )}
        </ul>
      </section>
    </main>
  );
}
