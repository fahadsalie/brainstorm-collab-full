'use client';

import { useEffect, useState } from 'react';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthProvider';

type Attachment = { id: string; name: string; url: string; by: string; at?: any };

export default function Attachments({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Attachment[]>([]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'projects', projectId, 'attachments'), orderBy('at', 'desc'));
    const un = onSnapshot(q, (snap) => {
      const list: Attachment[] = [];
      snap.forEach(d => list.push({ id: d.id, ...(d.data() as any) }));
      setItems(list);
    });
    return () => un();
  }, [projectId]);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!storage || !db || !user) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const storageRef = ref(storage, `attachments/${projectId}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await addDoc(collection(db, 'projects', projectId, 'attachments'), {
      name: file.name, url, by: user.displayName || user.email, at: serverTimestamp()
    });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onPick} />
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', marginTop: 12 }}>
        {items.map(a => (
          <figure key={a.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
            <img src={a.url} alt={a.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6 }} />
            <figcaption style={{ fontSize: 12, marginTop: 6 }}>
              {a.name}<br/>by {a.by} {a.at?.toDate ? `@ ${a.at.toDate().toLocaleString()}` : ''}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}