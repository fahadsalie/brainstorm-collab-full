'use client';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AuditLog({ projectId }: { projectId: string }) {
  const [items, setItems] = useState<DocumentData[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'projects', projectId, 'audit'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [projectId]);

  return (
    <div className="card p-4 h-full">
      <h3 className="text-lg font-semibold mb-2">Activity</h3>
      <div className="scroll max-h-[60vh] pr-2 space-y-3">
        {items.map((it) => (
          <div key={it.id} className="text-sm">
            <div className="text-slate-300">{it.text}</div>
            <div className="text-xs text-slate-500">{new Date(it.createdAt?.toDate?.() ?? Date.now()).toLocaleString()}</div>
          </div>
        ))}
        {!items.length && <div className="text-slate-500 text-sm">No activity yet.</div>}
      </div>
    </div>
  );
}
