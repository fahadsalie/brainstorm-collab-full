'use client';

import { useEffect, useRef, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, addDoc, collection } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import { v4 as uuid } from 'uuid';

type Tool = 'select' | 'process' | 'decision' | 'terminator' | 'database' | 'text';
type ShapeBase = { id: string; x: number; y: number; w: number; h: number; text?: string };
type Shape = ShapeBase & { type: Tool };
type CanvasState = { shapes: Shape[] };

const DEFAULT_STATE: CanvasState = { shapes: [] };

export default function FlowCanvas({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [tool, setTool] = useState<Tool>('select');
  const [state, setState] = useState<CanvasState>(DEFAULT_STATE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Live subscription
  useEffect(() => {
    if (!db || !projectId) return;
    const ref = doc(db, 'projects', projectId, 'state', 'canvas');
    const un = onSnapshot(ref, (snap) => setState(snap.exists() ? (snap.data() as CanvasState) : DEFAULT_STATE));
    return () => un();
  }, [projectId]);

  // Ensure doc exists
  useEffect(() => {
    (async () => {
      if (!db || !projectId) return;
      const ref = doc(db, 'projects', projectId, 'state', 'canvas');
      const snap = await getDoc(ref);
      if (!snap.exists()) await setDoc(ref, DEFAULT_STATE, { merge: true });
    })();
  }, [projectId]);

  const save = async (next: CanvasState, action: string) => {
    setState(next);
    if (!db) return;
    await setDoc(doc(db, 'projects', projectId, 'state', 'canvas'), next, { merge: true });
    await addDoc(collection(db, 'projects', projectId, 'audit'), {
      action, ts: serverTimestamp(), userName: user?.displayName || 'User'
    });
  };

  const addShape = (type: Tool) => {
    if (type === 'select') return;
    const s: Shape = { id: uuid(), type, x: 120, y: 120, w: 160, h: 80, text: type.toUpperCase() };
    void save({ ...state, shapes: [...state.shapes, s] }, `Added ${type} shape`);
  };

  const updateText = async (id: string, text: string) => {
    await save({ ...state, shapes: state.shapes.map(s => s.id === id ? { ...s, text } : s) }, 'Edited text');
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (tool !== 'select') return;
    const bounds = wrapRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const x = e.clientX - bounds.left + (wrapRef.current!.scrollLeft || 0);
    const y = e.clientY - bounds.top + (wrapRef.current!.scrollTop || 0);

    const hit = state.shapes.slice().reverse().find(s => x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h);
    if (!hit) { setSelectedId(null); return; }
    setSelectedId(hit.id);
    const start = { x, y, sx: hit.x, sy: hit.y };
    const move = (ev: MouseEvent) => {
      const x2 = ev.clientX - bounds.left + (wrapRef.current!.scrollLeft || 0);
      const y2 = ev.clientY - bounds.top + (wrapRef.current!.scrollTop || 0);
      const dx = x2 - start.x, dy = y2 - start.y;
      setState(curr => ({ ...curr, shapes: curr.shapes.map(s => s.id === hit.id ? { ...s, x: start.sx + dx, y: start.sy + dy } : s) }));
    };
    const up = async () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      await save(state, 'Moved shape');
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2">
        {(['select','process','decision','terminator','database','text'] as Tool[]).map(t => (
          <button
            key={t}
            onClick={() => (t === 'select' ? setTool('select') : addShape(t))}
            className={`px-3 py-1.5 rounded-lg border ${tool===t ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div
        ref={wrapRef}
        className="canvas-scroll relative h-[60vh] overflow-auto rounded-xl border bg-white dark:bg-neutral-950"
        onMouseDown={onMouseDown}
      >
        <svg width={2000} height={1200}>
          {state.shapes.map(s => {
            const common = { key: s.id, stroke: '#111', fill: '#fff' };
            if (s.type === 'process') return <rect {...common} x={s.x} y={s.y} width={s.w} height={s.h} rx={10} />;
            if (s.type === 'decision') {
              const pts = [
                [s.x + s.w/2, s.y],
                [s.x + s.w, s.y + s.h/2],
                [s.x + s.w/2, s.y + s.h],
                [s.x, s.y + s.h/2],
              ].map(p => p.join(',')).join(' ');
              return <polygon {...common} points={pts} />;
            }
            if (s.type === 'terminator') return <rect {...common} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.h/2} />;
            if (s.type === 'database') return (
              <>
                <rect {...common} x={s.x} y={s.y} width={s.w} height={s.h} rx={10} />
                <ellipse cx={s.x + s.w/2} cy={s.y + 10} rx={s.w/2 - 10} ry={10} fill="#fff" stroke="#111" />
              </>
            );
            if (s.type === 'text') return <rect {...common} x={s.x} y={s.y} width={s.w} height={s.h} rx={6} />;
            return null;
          })}
          {state.shapes.map(s => (
            <foreignObject key={s.id + '-txt'} x={s.x} y={s.y} width={s.w} height={s.h}>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateText(s.id, (e.target as HTMLDivElement).innerText)}
                className={`w-full h-full flex items-center justify-center text-center outline-none ${
                  selectedId === s.id ? 'ring-2 ring-brand-500 rounded-md' : ''
                }`}
              >
                {s.text}
              </div>
            </foreignObject>
          ))}
        </svg>
      </div>
    </div>
  );
}