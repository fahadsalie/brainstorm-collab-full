'use client';
import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthProvider';
import { v4 as uuid } from 'uuid';

type Note = { id: string; x: number; y: number; text: string; color: string; };

export default function NotesBoard({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects', projectId, 'notes'), (snap) => {
      setNotes(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => unsub();
  }, [projectId]);

  const createNote = async () => {
    const id = uuid();
    await addDoc(collection(db, 'projects', projectId, 'notes'), {
      id, x: 100 + Math.random()*200, y: 100 + Math.random()*120, text: 'New note', color: '#fde047',
      createdBy: user?.uid, updatedAt: serverTimestamp()
    });
    await addDoc(collection(db, 'projects', projectId, 'audit'), { text: `${user?.displayName} created a note`, createdAt: serverTimestamp() });
  };

  const updateNote = async (n: Note) => {
    const ref = doc(db, 'projects', projectId, 'notes', n.id);
    await updateDoc(ref, { x: n.x, y: n.y, text: n.text, color: n.color, updatedAt: serverTimestamp() });
  };

  const removeNote = async (id: string) => {
    await deleteDoc(doc(db, 'projects', projectId, 'notes', id));
    await addDoc(collection(db, 'projects', projectId, 'audit'), { text: `${user?.displayName} deleted a note`, createdAt: serverTimestamp() });
  };

  return (
    <div className="relative h-[60vh] w-full card overflow-hidden">
      <div className="p-3 flex justify-between">
        <h3 className="font-semibold">Sticky Notes</h3>
        <button className="btn" onClick={createNote}>Add Note</button>
      </div>
      <div className="relative w-full h-full" style={{cursor: 'default'}}>
        {notes.map(n => (
          <DraggableNote key={n.id} note={n} onChange={updateNote} onRemove={() => removeNote(n.id)} />
        ))}
      </div>
    </div>
  );
}

function DraggableNote({ note, onChange, onRemove }: { note: Note; onChange: (n: Note)=>void; onRemove: ()=>void }) {
  const [pos, setPos] = useState({ x: note.x, y: note.y });
  const [text, setText] = useState(note.text);
  const [color, setColor] = useState(note.color);

  useEffect(() => setText(note.text), [note.text]);

  const onDrag = (e: React.MouseEvent) => {
    if ((e.buttons & 1) === 0) return;
    setPos(p => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
  };
  const onDragEnd = () => onChange({ ...note, x: pos.x, y: pos.y, text, color });

  return (
    <div
      className="absolute shadow-lg rounded-lg p-3 w-56"
      style={{ left: pos.x, top: pos.y, background: color }}
      onMouseMove={onDrag}
      onMouseUp={onDragEnd}
    >
      <div className="flex justify-between mb-2">
        <input
          type="color"
          value={color}
          onChange={(ev) => setColor(ev.target.value)}
          onBlur={(ev) => onChange({ ...note, x: pos.x, y: pos.y, text, color: ev.target.value })}
        />
        <button className="text-sm text-red-700" onClick={onRemove}>×</button>
      </div>
      <textarea
        className="w-full h-24 bg-transparent outline-none resize-none"
        value={text} onChange={e => setText(e.target.value)}
        onBlur={() => onChange({ ...note, x: pos.x, y: pos.y, text, color })}
      />
    </div>
  );
}
