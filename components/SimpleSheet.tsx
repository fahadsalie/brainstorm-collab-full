'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, setDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Row = { id: string; cells: string[] };

export default function SimpleSheet({ projectId }: { projectId: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [cols, setCols] = useState(5);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects', projectId, 'sheetRows'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      setRows(list as any);
    });
    return () => unsub();
  }, [projectId]);

  const addRow = async () => {
    const id = Math.random().toString(36).slice(2);
    await setDoc(doc(db, 'projects', projectId, 'sheetRows', id), { id, cells: Array(cols).fill('') });
    await addDoc(collection(db, 'projects', projectId, 'audit'), { text: `Added sheet row`, createdAt: serverTimestamp() });
  };

  const updateCell = async (row: Row, c: number, val: string) => {
    const updated = [...row.cells]; updated[c] = val;
    await setDoc(doc(db, 'projects', projectId, 'sheetRows', row.id), { cells: updated }, { merge: true });
  };

  return (
    <div className="card p-4">
      <div className="flex justify-between mb-2">
        <h3 className="font-semibold">Sheet (simple)</h3>
        <button className="btn" onClick={addRow}>Add Row</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-3 py-2 text-left text-slate-400 border-b border-slate-700">{String.fromCharCode(65+i)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b border-slate-800">
                {Array.from({ length: cols }).map((_, c) => (
                  <td key={c} className="px-3 py-2">
                    <input className="input w-48" defaultValue={r.cells?.[c] ?? ''} onBlur={e => updateCell(r, c, e.target.value)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
