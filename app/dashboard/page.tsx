'use client';                         // must be first line
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'projects'), where('memberIds', 'array-contains', user.uid));
    return onSnapshot(q, snap => setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [user]);

  const create = async () => {
    if (!name.trim() || !user) return;
    const p = await addDoc(collection(db, 'projects'), {
      name, ownerId: user.uid, memberIds: [user.uid], createdAt: serverTimestamp()
    });
    setName('');
    location.href = `/project/${p.id}`;
  };

  return (
    <div className="space-y-6">
      <div className="card p-5 flex items-center gap-3">
        <input className="input flex-1" placeholder="New project name" value={name} onChange={e => setName(e.target.value)} />
        <button className="btn" onClick={create}>Create Project</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(p => (
          <Link key={p.id} href={`/project/${p.id}`} className="card p-5 hover:ring-2 hover:ring-blue-600">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-slate-500 mt-1">Members: {p.memberIds?.length ?? 1}</div>
          </Link>
        ))}
        {!projects.length && <div className="text-slate-500">No projects yet. Create one above.</div>}
      </div>
    </div>
  );
}
