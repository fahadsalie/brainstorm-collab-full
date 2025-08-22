'use client';
import { useEffect, useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthProvider';

export default function ChatPanel({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState<any[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'projects', projectId, 'chat'), orderBy('createdAt'));
    return onSnapshot(q, snap => {
      setMsgs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [projectId]);

  const send = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, 'projects', projectId, 'chat'), {
      text, uid: user?.uid, name: user?.displayName, createdAt: serverTimestamp()
    });
    setText('');
  };

  return (
    <div className="card p-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Chat</h3>
      <div className="scroll flex-1 pr-2 space-y-3">
        {msgs.map(m => (
          <div key={m.id}>
            <div className="text-sm"><span className="text-slate-400">{m.name || 'Anon'}</span>: {m.text}</div>
            <div className="text-xs text-slate-500">{m.createdAt?.toDate?.() ? m.createdAt.toDate().toLocaleString() : ''}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="mt-3 flex gap-2">
        <input className="input w-full" placeholder="Type a message..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => (e.key==='Enter'?send():null)} />
        <button className="btn" onClick={send}>Send</button>
      </div>
    </div>
  );
}
