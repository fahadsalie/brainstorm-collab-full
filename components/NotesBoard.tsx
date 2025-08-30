'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthProvider';

export default function NotesBoard({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'projects', projectId, 'notes'), orderBy('createdAt', 'desc'));
    const un = onSnapshot(q, (snap) => {
      const rows: any[] = [];
      snap.forEach((d) => rows.push({ id: d.id, ...(d.data() as any) }));
      setNotes(rows);
    });
    return () => un();
  }, [projectId]);

  const add = async () => {
    if (!user || !note.trim() || !db) return;
    await addDoc(collection(db, 'projects', projectId, 'notes'), {
      text: note.trim(),
      uid: user.uid,
      name: user.displayName || 'User',
      createdAt: serverTimestamp()
    });
    setNote('');
  };

  const remove = async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, 'projects', projectId, 'notes', id));
  };

  return (
    <div className="grid md:grid-cols-3 gap-3">
      <div className="md:col-span-2">
        <div className="flex gap-2 mb-3">
          <input className="flex-1 rounded-xl border px-3 py-2 bg-white dark:bg-neutral-950"
            placeholder="New note…" value={note}
            onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
          <button onClick={add} className="px-4 py-2 rounded-xl bg-neutral-900 text-white">Add</button>
        </div>
        <ul className="space-y-2">
          {notes.map(n => (
            <li key={n.id} className="border rounded-xl p-3 flex items-start justify-between">
              <div>
                <div className="text-sm text-neutral-500">{n.name}</div>
                <div>{n.text}</div>
              </div>
              <button onClick={() => remove(n.id)} className="text-sm text-red-600">Delete</button>
            </li>
          ))}
          {notes.length === 0 && <li className="text-neutral-500">No notes yet.</li>}
        </ul>
      </div>
      <div className="rounded-xl border p-3 bg-neutral-50 dark:bg-neutral-800/30">
        <div className="font-medium mb-2">Tips</div>
        <ul className="list-disc ml-5 text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
          <li>Use Canvas for diagrams & freehand ideas.</li>
          <li>All actions appear in the Audit tab.</li>
        </ul>
      </div>
    </div>
  );
}
