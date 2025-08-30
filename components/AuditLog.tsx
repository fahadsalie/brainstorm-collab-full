'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

type Row = { id: string; action: string; ts?: { seconds?: number }; userName?: string };

export default function AuditLog({ projectId }: { projectId: string }) {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'projects', projectId, 'audit'), orderBy('ts', 'desc'));
    const un = onSnapshot(q, (snap) => {
      const r: Row[] = [];
      snap.forEach((d) => r.push({ id: d.id, ...(d.data() as any) }));
      setRows(r);
    });
    return () => un();
  }, [projectId]);

  return (
    <div className="space-y-2">
      {rows.map((a) => (
        <div key={a.id} className="rounded-xl border p-3">
          <div className="text-sm text-neutral-500">
            {(a.userName ?? 'User')} • {new Date(((a.ts?.seconds ?? 0) * 1000)).toLocaleString()}
          </div>
          <div>{a.action}</div>
        </div>
      ))}
      {rows.length === 0 && <div className="text-neutral-500">No activity yet.</div>}
    </div>
  );
}