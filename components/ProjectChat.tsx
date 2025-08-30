'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthProvider';

export default function ProjectChat({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState<any[]>([]);

  useEffect(() => {
    if (!db || !projectId) return;
    const q = query(collection(db, 'projects', projectId, 'messages'), orderBy('createdAt', 'desc'));
    const un = onSnapshot(q, (snap) => {
      const rows: any[] = [];
      snap.forEach((d) => rows.push({ id: d.id, ...(d.data() as any) }));
      setMsgs(rows);
    });
    return () => un();
  }, [projectId]);

  const send = async () => {
    if (!db || !user || !text.trim()) return;
    await addDoc(collection(db, 'projects', projectId, 'messages'), {
      text: text.trim(),
      uid: user.uid,
      name: user.displayName || 'Anonymous',
      createdAt: serverTimestamp()
    });
    setText('');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="max-h-[60vh] overflow-auto">
        {msgs.map((m) => (
          <div key={m.id} className="py-1 text-sm">
            <span className="font-medium">{m.name}</span> <span className="text-neutral-500">•</span> {m.text}
          </div>
        ))}
        {msgs.length === 0 && <div className="text-neutral-500 text-sm">No messages yet.</div>}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 rounded-xl border px-3 py-2 bg-white dark:bg-neutral-950"
          placeholder="Type a message…" value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
        <button onClick={send} className="px-4 py-2 rounded-xl bg-neutral-900 text-white">Send</button>
      </div>
    </div>
  );
}
