'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthProvider';

type SheetMap = Record<string, string>;
const ROWS = 10;
const COLS = 6;

function emptyGrid(): string[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(''));
}

function mapFromGrid(grid: string[][]): SheetMap {
  const m: SheetMap = {};
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const val = grid[r][c];
      if (val && val.trim() !== '') {
        m[`${r},${c}`] = val;
      }
    }
  }
  return m;
}

function gridFromMap(m: SheetMap | undefined): string[][] {
  const g = emptyGrid();
  if (!m) return g;
  for (const key of Object.keys(m)) {
    const [rs, cs] = key.split(',');
    const r = Number(rs), c = Number(cs);
    if (Number.isFinite(r) && Number.isFinite(c) && r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      g[r][c] = m[key] ?? '';
    }
  }
  return g;
}

export default function SimpleSheet({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [grid, setGrid] = useState<string[][]>(emptyGrid());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!db) return;
    const ref = doc(db, 'projects', projectId);
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() || {};
      // Accept a flat map only (our saved format). If someone manually wrote an array, ignore it.
      if (data.sheet && typeof data.sheet === 'object' && !Array.isArray(data.sheet)) {
        setGrid(gridFromMap(data.sheet as SheetMap));
      } else {
        setGrid(emptyGrid());
      }
    });
    return () => unsub();
  }, [projectId]);

  async function save() {
    if (!db) return;
    setSaving(true);
    try {
      const ref = doc(db, 'projects', projectId);
      await updateDoc(ref, { sheet: mapFromGrid(grid) }); // ✅ flat map
      if (user) {
        await addDoc(collection(db, 'projects', projectId, 'audit'), {
          type: 'sheet_update', by: user.email, at: serverTimestamp(),
        });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save sheet'}</button>
      <div style={{ overflowX: 'auto', marginTop: 12 }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            {grid.map((row, r) => (
              <tr key={r}>
                {row.map((val, c) => (
                  <td key={c} style={{ border: '1px solid #ddd', padding: 6, minWidth: 120 }}>
                    <input
                      value={val}
                      onChange={e => {
                        const next = grid.map(x => [...x]);
                        next[r][c] = e.target.value;
                        setGrid(next);
                      }}
                      style={{ width: '100%', border: 'none', outline: 'none' }}
                      placeholder={`R${r + 1}C${c + 1}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
        Data is stored as a flat map (e.g., “0,0”: “Task”) to comply with Firestore (no nested arrays).
      </p>
    </div>
  );
}
